from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, QuoteRequest, SiteSettings, HeroImage
from .serializers import ProductSerializer, QuoteRequestSerializer, SiteSettingsSerializer, HeroImageSerializer

class SiteSettingsView(APIView):
    def get(self, request):
        settings = SiteSettings.objects.first()
        if not settings:
            settings = SiteSettings.objects.create()
        serializer = SiteSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)

class HeroImageListView(generics.ListAPIView):
    queryset = HeroImage.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroImageSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer

class QuoteRequestCreateView(generics.CreateAPIView):
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data.copy()
        
        # Handle stringified items from FormData
        if 'items' in data and isinstance(data['items'], str):
            import json
            try:
                data['items'] = json.loads(data['items'])
            except json.JSONDecodeError:
                return Response({"error": "Invalid items JSON format."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Save inspiration images
        quote_request = serializer.instance
        from .models import QuoteInspirationImage
        images = request.FILES.getlist('images')
        for image in images:
            QuoteInspirationImage.objects.create(quote_request=quote_request, image=image)

        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Quote request submitted successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
