import asyncio
from datetime import datetime
from graphene import Field, ObjectType, Schema, relay, String
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, SensorData as SensorDataModel
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
            'is_active': [...],  # shortcut!
        }


class Query(ObjectType):
    node = relay.Node.Field()
    
    # Allows sorting over multiple columns, by default over the primary key
    all_sensor_data = FilterableConnectionField(SensorData.connection, filters=SensorDataFilter())

schema = Schema(query=Query)