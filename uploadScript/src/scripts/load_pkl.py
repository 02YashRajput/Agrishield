import sys
import pandas as pd
import joblib 
from datetime import datetime, timedelta

def main():
    try:
         
        
        if len(sys.argv) != 4:
            print("Usage: process_data.py <pickle_path>  <district> <commodity> ")
            sys.exit(1)

        pickle_path = sys.argv[1]
    
        district = sys.argv[2]
        commodity = sys.argv[3]
        start_date = datetime.today().date()
        
    
     
        model = joblib.load(pickle_path)
        
        
        columns = ['District', 'Commodity', 'Year', 'Month', 'Day']
        
       
        
        
     
        predictions = []
        
        for i in range(12):
            
            next_month_date = start_date + timedelta(days=i * 30)  
            
           
            single_instance = pd.DataFrame([[ district, commodity, next_month_date.year, next_month_date.month, next_month_date.day]], columns=columns)
            
            
            single_instance_prediction = model.predict(single_instance)
            
           
            predictions.append(round(single_instance_prediction[0], 2))
            
       
        print(predictions)
            
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)


    
   
if __name__ == "__main__":
    main()
