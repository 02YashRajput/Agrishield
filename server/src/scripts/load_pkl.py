import sys
import pickle
import pandas as pd
import json

def main():
    # Retrieve arguments passed from the parent process
    if len(sys.argv) != 6:
        print("Usage: process_data.py <pickle_path> <state> <district> <commodity> <date>")
        sys.exit(1)

    pickle_path = sys.argv[1]
    state = sys.argv[2]
    district = sys.argv[3]
    commodity = sys.argv[4]
    date = sys.argv[5]
    
    print("Raw input: ", state, district, commodity, date)

    # Load the pickle file
    try:
        with open(pickle_path, 'rb') as f:
            model = pickle.load(f)
    except Exception as e:
        print(f"Error loading pickle file: {e}")
        sys.exit(1)

    # Create the input DataFrame
    feature_names = ["State", "District", "Commodity", "Arrival_Date"]
    input_data = [[state, district, commodity, date]]  # Wrap in a list to create a single-row DataFrame
    input_df = pd.DataFrame(input_data, columns=feature_names)

    # Make predictions
    try:
        predictions = model.predict(input_df)
        predictions_list = predictions.tolist()
        print(json.dumps(predictions_list))
    except Exception as e:
        print(f"Error during prediction: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
