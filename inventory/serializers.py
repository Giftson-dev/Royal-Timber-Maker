from rest_framework import serializers
from .models import Category, Product, QuoteRequest, QuoteItem, SiteSettings, HeroImage

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ['logo', 'favicon', 'hero_transition_seconds']

class HeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroImage
        fields = ['id', 'image', 'order', 'text_line_1', 'highlight_text', 'text_line_3']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'category', 'title', 'description', 'price', 'image', 'is_active', 'created_at']

class QuoteItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = QuoteItem
        fields = ['product_id', 'quantity', 'room_area']

class QuoteRequestSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True)

    class Meta:
        model = QuoteRequest
        fields = ['id', 'name', 'email', 'phone', 'location', 'message', 'items', 'created_at']
        extra_kwargs = {
            'phone': {'required': True, 'allow_blank': False}
        }

    def validate_phone(self, value):
        if not value:
            raise serializers.ValidationError("Phone number is mandatory.")
        # Remove any non-digit characters to check length
        clean_phone = ''.join(filter(str.isdigit, value))
        if len(clean_phone) < 10:
            raise serializers.ValidationError("Phone number must contain at least 10 digits.")
        if not value.replace('+', '').replace('-', '').replace(' ', '').isdigit():
             raise serializers.ValidationError("Phone number must contain only numbers.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        quote_request = QuoteRequest.objects.create(**validated_data)
        for item_data in items_data:
            product = item_data['product']
            unit_price = product.price if product.price else 0.00
            QuoteItem.objects.create(
                quote_request=quote_request, 
                unit_price=unit_price,
                **item_data
            )
        return quote_request
