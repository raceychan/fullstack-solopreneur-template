from src.app.api import app_factory

if __name__ == "__main__":
    lhl = app_factory()
    lhl.run(__file__)
