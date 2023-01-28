from flask import Flask, render_template, request, url_for
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.files['image']
    image.save(app.config['UPLOAD_FOLDER'] + image.filename)
    return render_template('index.html', image=image.filename)

if __name__ == '__main__':
    app.run()
