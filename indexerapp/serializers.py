from rest_framework import serializers
from decimal import Decimal

from .models import RiteNames, Content, Manuscripts, Contributors, Quires, ManuscriptHands, Hands, ScriptNames, Contributors, Places, TimeReference, ScriptNames, Sections, ContentFunctions, ManuscriptMusicNotations, EditionContent


class RiteNamesSerializer(serializers.ModelSerializer):

    class Meta:
        model = RiteNames
        fields = (
            'id', 'name'
        )

class ContributorsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contributors
        fields = (
            'id', 'initials', 'first_name', 'last_name'
        )
        
    def to_representation(self, instance):
    # Override to_representation to return initials instead of the full name
        return f"{instance.first_name[0].upper()}.{instance.last_name[0].upper()}."


class ScriptNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScriptNames
        fields = ['name']  # Include any other fields you want

class HandsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hands
        fields = ['name']  # Include any other fields you want


class PlacesSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='__str__', read_only=True)

    class Meta:
        model = Places
        fields = ['name']  # Include any other fields you want

class TimeReferenceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='__str__', read_only=True)


    class Meta:
        model = TimeReference
        fields = ['name']  # Include any other fields you want

class ScriptNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScriptNames
        fields = ['name']  # Include any other fields you want


class SectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sections
        fields = '__all__'

class ContentFunctionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentFunctions
        fields = '__all__'

class ManuscriptMusicNotationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManuscriptMusicNotations
        fields = '__all__'

class EditionContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EditionContent
        fields = '__all__'

class QuiresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quires
        fields = '__all__'

class ManuscriptsSerializer(serializers.ModelSerializer):
    contemporary_repository_place = PlacesSerializer()
    dating = TimeReferenceSerializer()
    place_of_origins = PlacesSerializer()
    main_script = ScriptNamesSerializer()
    binding_date = TimeReferenceSerializer()
    binding_place = PlacesSerializer()

    class Meta:
        model = Manuscripts
        fields = (
            'id',
            'name',
            'foreign_id',
            'image',
            'contemporary_repository_place',
            'shelf_mark',
            'dating',
            'place_of_origins',
            'main_script',
            'how_many_columns_mostly',
            'lines_per_page_usually',
            'how_many_quires',
            'foliation_or_pagination',
            'decorated',
            'music_notation',
            'binding_date',
            'binding_place',
        )
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert contributors to a comma-separated list of initials
        representation['contemporary_repository_place'] = str(instance.contemporary_repository_place)
        representation['dating'] = str(instance.dating)
        representation['place_of_origins'] = str(instance.place_of_origins)
        representation['main_script'] = str(instance.main_script)
        representation['binding_date'] = str(instance.binding_date)
        representation['binding_place'] = str(instance.binding_place)

        return representation

class ManuscriptHandsSerializer(serializers.ModelSerializer):
    manuscript = ManuscriptsSerializer()
    hand = HandsSerializer()
    script_name = ScriptNamesSerializer()
    authors = ContributorsSerializer(many=True)
    data_contributor = ContributorsSerializer()

    class Meta:
        model = ManuscriptHands
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['manuscript'] = str(instance.manuscript)
        representation['hand'] = str(instance.hand)
        representation['script_name'] = str(instance.script_name)
        representation['authors'] = ", ".join(
            [str(contributor) for contributor in instance.authors.all()]
        )
        representation['data_contributor'] = str(instance.data_contributor)
        return representation

class ContentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    #ms_name = str(id)

    manuscript = ManuscriptsSerializer
    manuscript_name = serializers.SerializerMethodField()
    rite = RiteNamesSerializer
    formula_standarized = serializers.SerializerMethodField()
    data_contributor = ContributorsSerializer
    authors = ContributorsSerializer(many=True)
    similarity_levenshtein_percent = serializers.DecimalField(max_digits=5, decimal_places=1) 
    
    section = SectionsSerializer
    subsection  = SectionsSerializer
    function = ContentFunctionsSerializer
    subfunction = ContentFunctionsSerializer
    quire = QuiresSerializer
    music_notation = ManuscriptMusicNotationsSerializer
    edition_index = EditionContentSerializer



    class Meta:
        model = Content
        fields = (
            'id', 'manuscript', 'quire', 'manuscript_name', 'section', 'subsection','function', 'subfunction', 'biblical_reference', 'formula', 'formula_standarized', 'music_notation', 'rite', 'rite_name_from_ms', 'formula_text', 'sequence_in_ms', 'where_in_ms_from', 'where_in_ms_to', 'similarity_by_user', 'similarity_levenshtein', 'similarity_levenshtein_percent', 'original_or_added', 'reference_to_other_items', 'subrite_name_from_ms', 'edition_index', 'edition_subindex', 'data_contributor', 'authors', 'proper_texts' 
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert contributors to a comma-separated list of initials
        representation['authors'] = ", ".join(
            [str(contributor) for contributor in instance.authors.all()]
        )
        representation['data_contributor'] = str(instance.data_contributor)

        representation['section'] = str(instance.section)
        representation['subsection'] = str(instance.subsection)
        representation['function'] = str(instance.function)
        representation['subfunction'] = str(instance.subfunction)
        representation['quire'] = str(instance.quire)
        representation['music_notation'] = str(instance.music_notation)
        representation['edition_index'] = str(instance.edition_index)
        
        return representation

    def get_liturgical_genre(self, content):
        return ', '.join([str(genre) for content in content.content_genres.all()])

    def get_manuscript_name(self, content):
        return content.manuscript.name

    def get_formula_standarized(self, content):
        if content.formula:
            return content.formula.text
        return ''

    def get_data_contributor(self, content):
        return content.data_contributor.initials
