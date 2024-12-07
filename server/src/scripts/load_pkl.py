import pickle
import sys


pickle_file = sys.argv[1]
State = sys.argv[2]
District = sys.argv[3]
Commodity = sys.argv[4]
Arrival_Date = sys.argv[5]
try:
    with open(pickle_file, 'rb') as file:
        model = pickle.load(file)     
        result = model.predict(State, District, Commodity, Arrival_Date)
        print(result)
except FileNotFoundError:
    print(f"Error: File {pickle_file} not found.")
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
