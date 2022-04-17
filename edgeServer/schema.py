import asyncio
from datetime import datetime
from graphene import Field, ObjectType, Schema, relay, String
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, SensorData as SensorDataModel

class SensorData(SQLAlchemyObjectType):
    class Meta:
        model = SensorDataModel
        interfaces = (relay.Node, )


class Query(ObjectType):
    node = relay.Node.Field()
    
    # Allows sorting over multiple columns, by default over the primary key
    all_sensor_data = SQLAlchemyConnectionField(SensorData.connection)

schema = Schema(query=Query)