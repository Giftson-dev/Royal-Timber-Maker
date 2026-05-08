from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/', help_text="Upload WebP format if possible.")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class QuoteRequest(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def final_amount(self):
        return self.total_amount - self.discount

    @property
    def balance(self):
        return self.final_amount - self.amount_paid

    def __str__(self):
        return f"Quote Request from {self.name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class QuoteItem(models.Model):
    quote_request = models.ForeignKey(QuoteRequest, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    room_area = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Master Bedroom")

    @property
    def total_price(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.quantity} x {self.product.title if self.product else 'Unknown Product'}"

class QuoteInspirationImage(models.Model):
    quote_request = models.ForeignKey(QuoteRequest, related_name='inspiration_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='quote_inspirations/', help_text="Client inspiration images")

    def __str__(self):
        return f"Inspiration for Quote #{self.quote_request.id}"

class SiteSettings(models.Model):
    logo = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Upload your logo (WebP or PNG)")
    favicon = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Upload your favicon (ICO or PNG)")
    hero_transition_seconds = models.PositiveIntegerField(default=7, help_text="Number of seconds each hero image stays on screen")

    class Meta:
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            return
        super(SiteSettings, self).save(*args, **kwargs)

    def __str__(self):
        return "Royal Timber Makers Site Settings"

class HeroImage(models.Model):
    image = models.ImageField(upload_to='hero/', help_text="Upload your hero background images (WebP)")
    order = models.PositiveIntegerField(default=0, help_text="Order in which they appear")
    is_active = models.BooleanField(default=True)
    text_line_1 = models.CharField(max_length=100, default="Authentic", help_text="First line of text (e.g., 'Authentic')")
    highlight_text = models.CharField(max_length=100, default="Locally Made", help_text="Middle highlighted/outlined text (e.g., 'Locally Made')")
    text_line_3 = models.CharField(max_length=100, default="Furniture.", help_text="Bottom line of text (e.g., 'Furniture.')")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Hero Image {self.order} ({self.text_line_1} {self.highlight_text})"

from django.contrib.auth.models import User

class UserActivity(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='activity')
    last_interaction_time = models.DateTimeField(auto_now=True)
    last_interaction_path = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Last seen: {self.last_interaction_time}"

class AdminNotification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification: {self.message[:50]}..."

