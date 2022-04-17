from graphql import GraphQLCoreBackend
import serial
import time
from flask import Flask
from flask_graphql import GraphQLView
from models import db_session, SensorData
from schema import schema
from threading import Thread

class GraphQLCustomCoreBackend(GraphQLCoreBackend):
    def __init__(self, executor=None):
        super().__init__(executor)
        self.execute_params['allow_subscriptions'] = True

app = Flask(__name__)
ser = serial.Serial('/dev/ttyS0', 9600)

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
        backend=GraphQLCustomCoreBackend()
    )
)
    

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

def read_serial():
    while True:
        if (ser.inWaiting() > 0):
            line = ser.readline().decode("utf-8").strip().split(", ")
            sensorDataRow = SensorData(
                ldr_analog_voltage = line[0], 
                humidity_percentage = line[1],
                tempurature_celcius = line[2],
                heat_index_celcius = line[3]
            )
            db_session.add(sensorDataRow)
            db_session.commit()
            print(line)
        time.sleep(0.01)

if __name__ == '__main__':
    thread = Thread(target=read_serial)
    thread.daemon = True
    thread.start()
    app.run(host="0.0.0.0")