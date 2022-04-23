from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("postgresql://pi:password@localhost/sensordb")
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


class SensorData(Base):
    __tablename__ = 'sensor_data'
    date_time = Column(DateTime, primary_key=True, default=func.now())
    ldr_analog_voltage = Column(String)
    humidity_percentage = Column(String)
    tempurature_celcius = Column(String)
    heat_index_celcius = Column(String)

class SensorTriggers:
    def __init__(self, ldr_min_threshold = 100, temp_max_threshold = 25):
        self.ldr_min_threshold = ldr_min_threshold
        self.temp_max_threshold = temp_max_threshold