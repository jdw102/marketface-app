

class ModelMetadata:
    def __init__(self, name, model_type, stock, train_start_date, train_end_date, features_used, epochs, window_size, model_file_link, rmse, mape, dir_acc):
        self.name = name
        self.model_type = model_type
        self.stock = stock
        self.train_start_date = train_start_date
        self.train_end_date = train_end_date
        self.features_used = features_used
        self.epochs = epochs
        self.window_size = window_size
        self.model_file_link = model_file_link
        self.rmse = rmse
        self.mape = mape
        self.dir_acc = dir_acc
    
    def get_dict(self):
        return {
            "name": self.name,
            "model_type": self.model_type,
            "stock": self.stock,
            "train_start_date": self.train_start_date,
            "train_end_date": self.train_end_date,
            "features_used": self.features_used,
            "epochs": self.epochs,
            "window_size": self.window_size,
            "model_file_link": self.model_file_link,
            "rmse": self.rmse,
            "mape": self.mape,
            "dir_acc": self.dir_acc
        }