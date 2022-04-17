from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("postgresql://pi:password@localhost/sensordb")
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
# We will need this for querying
Base.query = db_session.query_property()


class SensorData(Base):
    __tablename__ = 'sensor_data'
    date_time = Column(DateTime, primary_key=True, default=func.now())
    ldr_analog_voltage = Column(String)
    humidity_percentage = Column(String)
    tempurature_celcius = Column(String)
    heat_index_celcius = Column(String)