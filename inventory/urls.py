from django.urls import path
from .views import ProductListView, QuoteRequestCreateView, SiteSettingsView, HeroImageListView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('quote-request/', QuoteRequestCreateView.as_view(), name='quote-request-create'),
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('hero-images/', HeroImageListView.as_view(), name='hero-images'),
]
