from cx_Freeze import setup, Executable

base = None    

executables = [Executable("app.py", base=base)]

packages = ["idna"]
options = {
    'build_exe': {    
        'packages':packages,
    },    
}

setup(
    name = "dexArb",
    options = options,
    version = "0.1",
    description = "it's alive!",
    executables = executables
)
