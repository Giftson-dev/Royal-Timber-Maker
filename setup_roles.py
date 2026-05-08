import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from inventory.models import Category, Product, QuoteRequest, HeroImage

def setup_roles():
    # Create Content Manager group
    group, created = Group.objects.get_or_create(name='Content Manager')
    
    if created:
        print("Created 'Content Manager' group.")
    else:
        print("'Content Manager' group already exists. Updating permissions...")

    # Get content types
    category_ct = ContentType.objects.get_for_model(Category)
    product_ct = ContentType.objects.get_for_model(Product)
    quote_ct = ContentType.objects.get_for_model(QuoteRequest)
    hero_ct = ContentType.objects.get_for_model(HeroImage)

    # Assign permissions
    permissions = []
    
    # Category permissions
    permissions.extend(Permission.objects.filter(content_type=category_ct))
    # Product permissions
    permissions.extend(Permission.objects.filter(content_type=product_ct))
    # HeroImage permissions
    permissions.extend(Permission.objects.filter(content_type=hero_ct))
    # QuoteRequest permissions (VIEW ONLY)
    view_quote_perm = Permission.objects.get(content_type=quote_ct, codename='view_quoterequest')
    permissions.append(view_quote_perm)

    group.permissions.set(permissions)
    print("Permissions successfully assigned to 'Content Manager' group.")

if __name__ == '__main__':
    setup_roles()
