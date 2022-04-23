from graphene import Field, ObjectType, Schema, relay
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, SensorData as SensorDataModel, SensorTriggers as SensorTriggersModel
import state
from graphene_sqlalchemy_filter import FilterableConnectionField, FilterSet

class SensorData(SQLAlchemyObjectType):
    class Meta:
        model = SensorDataModel
        interfaces = (relay.Node, )

class SensorDataFilter(FilterSet):
    class Meta:
        model = SensorDataModel
        fields = {
            'date_time': ['range', 'gte', 'gt', 'lte', 'lt'],
            'is_active': [...],
        }

class SensorTriggers(graphene.ObjectType):
    ldr_min_threshold = graphene.Int()
    temp_max_threshold = graphene.Int()

class EditSensorTriggers(graphene.Mutation):
    class Arguments:
        ldr_min_threshold = graphene.Int()
        temp_max_threshold = graphene.Int()

    Output = SensorTriggers

    def mutate(root, info, ldr_min_threshold, temp_max_threshold):
        state.sensorTriggers = SensorTriggersModel(
            ldr_min_threshold = ldr_min_threshold,
            temp_max_threshold = temp_max_threshold
        )
        return state.sensorTriggers

class MyMutations(graphene.ObjectType):
    edit_sensor_triggers = EditSensorTriggers.Field()

class Query(ObjectType):
    node = relay.Node.Field()
    
    all_sensor_data = FilterableConnectionField(SensorData.connection, filters=SensorDataFilter())

    sensor_triggers = Field(SensorTriggers)

    def resolve_sensor_triggers(root, info):
        return state.sensorTriggers

schema = Schema(query=Query, mutation=MyMutations)