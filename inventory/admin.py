from django.contrib import admin
from .models import Category, Product, QuoteRequest, QuoteItem, QuoteInspirationImage, SiteSettings, HeroImage

class QuoteItemInline(admin.TabularInline):
    model = QuoteItem
    fields = ('product', 'quantity', 'unit_price', 'total_price')
    readonly_fields = ('total_price',)
    extra = 0

class QuoteInspirationImageInline(admin.TabularInline):
    model = QuoteInspirationImage
    extra = 0
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            from django.utils.html import format_html
            return format_html('<img src="{}" style="max-height: 150px;"/>', obj.image.url)
        return ""
    image_preview.short_description = 'Preview'

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    # Only allow adding if it doesn't exist
    def has_add_permission(self, request):
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)

@admin.register(HeroImage)
class HeroImageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'order', 'is_active')
    list_editable = ('order', 'is_active')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')

from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa

@admin.action(description='Generate PDF Invoices')
def generate_pdf_invoice(modeladmin, request, queryset):
    from .models import SiteSettings
    settings = SiteSettings.objects.first()
    
    for quote in queryset:
        html_string = render_to_string('inventory/invoice_pdf.html', {
            'quote': quote,
            'settings': settings,
            'base_url': request.build_absolute_uri('/')[:-1]
        })
        response = HttpResponse(content_type='application/pdf')
        filename = f"{quote.name.replace(' ', '_')}_Quote.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        pisa_status = pisa.CreatePDF(html_string, dest=response)
        
        if pisa_status.err:
            return HttpResponse('We had some errors <pre>' + html_string + '</pre>')
        return response

@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'total_amount', 'final_amount', 'balance')
    inlines = [QuoteItemInline, QuoteInspirationImageInline]
    readonly_fields = ('created_at', 'pdf_download_link')
    actions = [generate_pdf_invoice]

    def pdf_download_link(self, obj):
        from django.urls import reverse
        from django.utils.html import format_html
        if obj.pk:
            # We use the custom URL we defined in get_urls
            url = reverse('admin:generate_quote_pdf', args=[obj.pk])
            return format_html('<a class="button" href="{}" target="_blank" style="background-color: #E06D53; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">Download PDF Invoice</a>', url)
        return "Save first to enable PDF download"
    pdf_download_link.short_description = 'Action'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('<int:quote_id>/generate-pdf/', self.admin_site.admin_view(self.generate_single_pdf), name='generate_quote_pdf'),
        ]
        return custom_urls + urls

    def generate_single_pdf(self, request, quote_id):
        quote = self.get_object(request, quote_id)
        return generate_pdf_invoice(self, request, [quote])

from django.contrib.auth.models import User, Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserActivity, AdminNotification

class UserActivityInline(admin.StackedInline):
    model = UserActivity
    can_delete = False
    readonly_fields = ('last_interaction_time', 'last_interaction_path')
    verbose_name_plural = 'Activity Tracking'

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    search_fields = ['name', 'codename', 'content_type__app_label']

from django import forms

class UserAdminForm(forms.ModelForm):
    inventory_access = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.filter(content_type__app_label='inventory', content_type__model__in=['product', 'category']),
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'custom-checkboxes'}),
        required=False,
        label="🛋️ Product & Catalog Management",
        help_text="Check these to allow the user to Add, Edit, or Delete furniture products."
    )
    quote_access = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.filter(content_type__app_label='inventory', content_type__model='quoterequest'),
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'custom-checkboxes'}),
        required=False,
        label="💬 Customer Quotes & Sales",
        help_text="Check these to allow the user to view and process incoming quotes."
    )
    system_access = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.filter(content_type__app_label='inventory', content_type__model__in=['sitesettings', 'heroimage', 'adminnotification']),
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'custom-checkboxes'}),
        required=False,
        label="⚙️ Website Settings & Branding",
        help_text="Check these to allow the user to change the logo, hero images, and settings."
    )

    class Meta:
        model = User
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            perms = self.instance.user_permissions.all()
            self.fields['inventory_access'].initial = perms
            self.fields['quote_access'].initial = perms
            self.fields['system_access'].initial = perms

class UserAdmin(BaseUserAdmin):
    form = UserAdminForm
    inlines = (UserActivityInline,)
    actions = ['send_password_reset_email']
    
    fieldsets = (
        ('User Credentials', {
            'fields': ('username', 'email', 'password'),
            'description': 'The login details for this user.'
        }),
        ('Admin Toggles (Danger Zone)', {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
            'classes': ('collapse',),
            'description': 'Staff status allows login. Superuser grants all permissions instantly.'
        }),
        ('User Role: Inventory Manager', {
            'fields': ('inventory_access',),
            'description': 'Give this user power over the shop items.'
        }),
        ('User Role: Sales Representative', {
            'fields': ('quote_access',),
            'description': 'Give this user power to handle customer quotes.'
        }),
        ('User Role: Webmaster', {
            'fields': ('system_access',),
            'description': 'Give this user power to change the look of the site.'
        }),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if 'inventory_access' in form.cleaned_data:
            all_perms = list(form.cleaned_data.get('inventory_access', [])) + \
                        list(form.cleaned_data.get('quote_access', [])) + \
                        list(form.cleaned_data.get('system_access', []))
            obj.user_permissions.set(all_perms)

    def send_password_reset_email(self, request, queryset):
        from django.contrib.auth.forms import PasswordResetForm
        for user in queryset:
            form = PasswordResetForm({'email': user.email})
            if form.is_valid():
                form.save(
                    request=request,
                    use_https=request.is_secure(),
                    email_template_name='registration/password_reset_email.html',
                    subject_template_name='registration/password_reset_subject.txt',
                )
        self.message_user(request, f"Password reset links have been sent to {queryset.count()} users.")
    send_password_reset_email.short_description = "Send Password Reset Link to selected users"

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(AdminNotification)
class AdminNotificationAdmin(admin.ModelAdmin):
    list_display = ('message', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    readonly_fields = ('message', 'created_at')

    def has_add_permission(self, request):
        return False
