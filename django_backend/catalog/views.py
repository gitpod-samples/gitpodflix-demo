from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by('-rating')
    serializer_class = MovieSerializer
    
    @action(detail=False, methods=['post'])
    def seed(self, request):
        # Clear existing movies
        Movie.objects.all().delete()
        
        # Seed sample data
        sample_movies = [
            {
                'title': 'The Shawshank Redemption',
                'description': 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                'release_year': 1994,
                'rating': 9.3,
                'image_url': 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg'
            },
            {
                'title': 'The Godfather',
                'description': 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
                'release_year': 1972,
                'rating': 9.2,
                'image_url': 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
            },
            {
                'title': 'The Dark Knight',
                'description': 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                'release_year': 2008,
                'rating': 9.0,
                'image_url': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'
            },
            {
                'title': 'Pulp Fiction',
                'description': 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
                'release_year': 1994,
                'rating': 8.9,
                'image_url': 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
            },
            {
                'title': 'Fight Club',
                'description': 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
                'release_year': 1999,
                'rating': 8.8,
                'image_url': 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg'
            }
        ]
        
        for movie_data in sample_movies:
            Movie.objects.create(**movie_data)
        
        return Response({'message': 'Database seeded successfully'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        Movie.objects.all().delete()
        return Response({'message': 'Database cleared successfully'}, status=status.HTTP_200_OK)
