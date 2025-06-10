from src.app.api import app_factory

app = app_factory()


if __name__ == "__main__":
    app.run(__file__)
