from flask import Flask, render_template, flash, request, redirect, url_for, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref
import flask
import datetime
# from flask_session import Session # Server redis (filesystem) sided sessions for later
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import base64
from sqlalchemy.orm import joinedload

# Initialize Flask App
app = Flask(__name__)
CORS(app, supports_credentials=True)

bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = 'StackNET Makings In Progress!'

# SqlAlchemy Database Configuration With Mysql
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:''@localhost/stacknet'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)
ma = Marshmallow(app)


app.app_context().push()


class Users(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    uimg = db.Column(db.LargeBinary, nullable=True)
    fullname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(35), unique=True, nullable=False)
    pwd = db.Column(db.String(80), nullable=False)
    gender = db.Column(db.String(6), nullable=False)
    sec_ques = db.Column(db.String(80), nullable=False)
    sec_ans = db.Column(db.String(80), nullable=False)
    date_joined = db.Column(
        db.DateTime, default=datetime.datetime.now(), nullable=False)
    total_posts = db.Column(db.Integer, default=0, nullable=True)
    role = db.Column(db.String(10), default='user', nullable=False)
    bio = db.Column(db.Text(), default='', nullable=True)

    def __init__(self, fullname, email, pwd, gender, sec_ques, sec_ans):
        self.fullname = fullname
        self.email = email
        self.pwd = pwd
        self.gender = gender
        self.sec_ques = sec_ques
        self.sec_ans = sec_ans


class Posts(db.Model):
    __tablename__ = "Posts"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    title = db.Column(db.Text(), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    date = db.Column(
        db.DateTime, default=datetime.datetime.now(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
    categ = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(30), nullable=False)
    views = db.Column(db.Integer, default=0, nullable=True)
    replies = db.Column(db.Integer, default=0, nullable=True)
    user = db.relationship("Users", backref=backref(
        "n_posts", cascade="all,delete"))

    def __init__(self, title, content, user_id, categ, status):
        self.title = title
        self.content = content
        self.user_id = user_id
        self.categ = categ
        self.status = status


class Comments(db.Model):
    __tablename__ = "Comments"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    content = db.Column(db.Text(), nullable=False)
    date = db.Column(
        db.DateTime, default=datetime.datetime.now(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("Posts.id"), nullable=False)
    post = db.relationship("Posts", backref=backref(
        "n_comments", cascade="all,delete"))

    def __init__(self, content, user_id, post_id):
        self.content = content
        self.user_id = user_id
        self.post_id = post_id


# Marshmallow to make objects serializable and to jsonify

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'uimg', 'fullname', 'email', 'pwd', 'gender',
                  'sec_ques', 'sec_ans', 'date_joined', 'total_posts', 'role', 'bio')


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class PostSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'content', 'date',
                  'user_id', 'categ', 'views', 'replies', 'status')


post_schema = PostSchema()
posts_schema = PostSchema(many=True)


class CommentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'content', 'date', 'user_id', 'post_id')


comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/get_posts', methods=['GET'])
def get_posts():
    args = request.args
    param_uid = args.get('id')
    li = []
    if param_uid is not None:
        all_posts = db.session.query(Users, Posts).join(Posts).filter(
            Posts.user_id == param_uid, Posts.status == "approved").order_by(Posts.id.desc())

    else:
        all_posts = db.session.query(Users, Posts).join(
            Posts).filter(
            Posts.status == "approved").order_by(Posts.id.desc()).limit(6)

    for users, posts in all_posts:

        if users.uimg is not None:
            uii = base64.b64encode(users.uimg)
            uii = uii.decode("UTF-8")

            obj = {
                "fullname": users.fullname,
                "user_id": users.id,
                "categ": posts.categ,
                "id": posts.id,
                "uimg": uii,
                "title": posts.title,
                "content": posts.content,
                "date": posts.date,
                "views": posts.views,
                "replies": posts.replies
            }
            li.append(obj)

    return (li), 200


@app.route('/get_comments', methods=['GET'])
def get_comments():
    all_comments = Comments.query.all()
    results = comments_schema.dump(all_comments)
    return jsonify(results)


@app.route('/get_users', methods=['GET'])
def get_users():
    all_users = Users.query.all()
    for user in all_users:
        if user.uimg is not None:
            uii = base64.b64encode(user.uimg)
            uii = uii.decode("UTF-8")
            user.uimg = uii
    results = users_schema.dump(all_users)
    return jsonify(results)


@app.route('/u/profile/', methods=['GET'])
def get_user_p():
    id = session["user_id"]
    if not id:
        return jsonify({"error": "unauthorized access!"}), 401
    user = Users.query.filter_by(id=id).first()
    if user.uimg is not None:
        uii = base64.b64encode(user.uimg)
        uii = uii.decode("UTF-8")
        # print(uii)
        user.uimg = uii
    result = user_schema.dump(user)
    return jsonify(result)


@app.route('/search_post', methods=['GET'])
def search_post():
    args = request.args
    search = args.get('search')
    posts = Posts.query.with_entities(Posts.title, Posts.id).filter(
        Posts.title.like('%' + search + '%')).all()
    results = posts_schema.dump(posts)
    return jsonify(results)


@app.route('/post/<id>/', methods=['GET'])
def post_details(id):
    postd = Posts.query.get(id)
    postd.views = postd.views + 1

    post = db.session.query(Users, Posts).join(Posts).filter(Posts.id == id)
    for users, posts in post:

        if users.uimg is not None:
            uii = base64.b64encode(users.uimg)
            uii = uii.decode("UTF-8")
        obj = {
            "fullname": users.fullname,
            "user_id": users.id,
            "categ": posts.categ,
            "uimg": uii,
            "id": posts.id,
            "title": posts.title,
            "content": posts.content,
            "date": posts.date,
            "views": posts.views,
            "replies": posts.replies
        }
    li2 = []

    comment = db.session.query(Users, Comments).join(Comments).filter(
        Comments.post_id == id).order_by(Comments.id.desc())

    for user, comments in comment:

        if user.uimg is not None:
            uii = base64.b64encode(user.uimg)
            uii = uii.decode("UTF-8")
        obj2 = {
            "fullname": user.fullname,
            "user_id": user.id,
            "id": comments.id,
            "uimg": uii,
            "content": comments.content,
            "date": comments.date,
            "post_id": comments.post_id
        }
        li2.append(obj2)

    db.session.commit()
    return jsonify(obj, li2)


@app.route('/discussions/<string:category>/', methods=['GET'])
def post_by_categories(category):
    args = request.args
    sort = args.get('sort')
    li = []
    if sort == "Top":
        result = db.session.query(Users, Posts).join(Posts).filter(
            Posts.categ == category, Posts.status == "approved").order_by(Posts.replies.desc())
    if sort == "Latest":
        result = db.session.query(Users, Posts).join(Posts).filter(
            Posts.categ == category, Posts.status == "approved").order_by(Posts.id.desc())
    if sort == "Oldest":
        result = db.session.query(Users, Posts).join(Posts).filter(
            Posts.categ == category, Posts.status == "approved").order_by(Posts.id.asc())
    if sort == "Popular":
        result = db.session.query(Users, Posts).join(Posts).filter(
            Posts.categ == category, Posts.status == "approved").order_by(Posts.views.desc())

    for users, posts in result:

        if users.uimg is not None:
            uii = base64.b64encode(users.uimg)
            uii = uii.decode("UTF-8")
        obj = {
            "fullname": users.fullname,
            "user_id": users.id,
            "categ": posts.categ,
            "id": posts.id,
            "uimg": uii,
            "title": posts.title,
            "content": posts.content,
            "date": posts.date,
            "views": posts.views,
            "replies": posts.replies
        }
        li.append(obj)
    return (li), 200


@app.route('/add_post', methods=['POST'])
def add_post():
    content = request.json['content']
    u_id = request.json['user_id']
    title = request.json['title']
    categ = request.json['categ']
    if (categ == "Projects" or categ == "Tutorials"):
        status = "pending"
    # Model verification goes here and change status to approved if valid
    else:
        status = "approved"
    print(categ, status)
    posts = Posts(title, content, u_id, categ, status)
    user = Users.query.filter_by(id=u_id).first()
    user.total_posts = user.total_posts + 1
    db.session.add(posts)
    db.session.commit()
    return post_schema.jsonify(posts)


@app.route('/add_comment', methods=['POST'])
def add_comment():
    content = request.json['content']
    post_id = request.json['post_id']
    u_id = request.json['user_id']
    comments = Comments(content, u_id, post_id)
    postd = Posts.query.get(post_id)
    postd.replies = postd.replies + 1
    db.session.add(comments)
    db.session.commit()
    return jsonify({
        "success": "Comment posted"
    }), 200


@app.route('/update_comment/<id>/', methods=['PUT'])
def comment_update(id):
    commentd = Comments.query.get(id)
    # title of post update
    content = request.json['content']
    commentd.content = content
    db.session.commit()
    return post_schema.jsonify(commentd)


@app.route('/update_email', methods=['PUT'])
def email_update():
    email = request.json['email']
    new_email = request.json['new_email']
    password = request.json['password']
    user = Users.query.filter_by(email=email).first()

    if user.email == new_email:
        return jsonify({"error": "Email already exists!"}), 401

    if not bcrypt.check_password_hash(user.pwd, password):
        return jsonify({"error": "Invalid password!"}), 401

    content = request.json['new_email']
    user.email = content
    db.session.commit()
    return jsonify({
        "success": "Email changed successfully!"
    }), 200


@app.route('/updateBio', methods=['PUT'])
def bio_update():
    id = request.json['id']
    ubio = request.json['bio']
    user = Users.query.filter_by(id=id).first()
    user.bio = ubio
    db.session.commit()
    return jsonify({
        "success": "Bio changed successfully!"
    }), 200


@app.route('/update_password', methods=['PUT'])
def password_update():
    email = request.json['email']
    password = request.json['password']
    new_password = request.json['new_password']
    user = Users.query.filter_by(email=email).first()

    if not bcrypt.check_password_hash(user.pwd, password):
        return jsonify({"error": "Incorrect current password!"}), 401

    hashed_pwd = bcrypt.generate_password_hash(new_password)
    user.pwd = hashed_pwd
    db.session.commit()
    return jsonify({
        "success": "Password changed successfully!"
    }), 200


@app.route('/get_secQues/<string:email>', methods=['GET'])
def get_secQues(email):
    user = Users.query.filter_by(email=email).first()
    sec_ques = user.sec_ques
    return jsonify(sec_ques)


@app.route('/get_sideLinks', methods=['GET'])
def post_by_sort():

    topPosts = Posts.query.order_by(Posts.views.desc()).limit(5)
    popularPosts = Posts.query.order_by(Posts.replies.desc()).limit(5)
    top = posts_schema.dump(topPosts)
    popular = posts_schema.dump(popularPosts)
    result = [top, popular]
    return jsonify(result)


@app.route('/reset_password', methods=['PUT'])
def reset_password():
    email = request.json['email']
    password = request.json['password']
    answer = request.json['answer']
    user = Users.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Email does not exist!"}), 401

    if not user.sec_ans == answer:
        return jsonify({"error": "Incorrect answer of security question!"}), 401

    if bcrypt.check_password_hash(user.pwd, password):
        return jsonify({"error": "New password cannot be your current password!"}), 401

    hashed_pwd = bcrypt.generate_password_hash(password)
    user.pwd = hashed_pwd
    db.session.commit()
    return jsonify({
        "success": "Password changed successfully!"
    }), 200


@app.route('/update_post/<id>/', methods=['PUT'])
def post_update(id):
    postd = Posts.query.get(id)
    # title of post update
    content = request.json['content']
    postd.content = content
    db.session.commit()
    return post_schema.jsonify(postd)


@app.route('/delete_post/<id>/', methods=['DELETE'])
def post_delete(id):
    postd = Posts.query.get(id)
    user = Users.query.filter_by(id=postd.user_id).first()
    user.total_posts = user.total_posts - 1
    db.session.delete(postd)
    db.session.commit()
    return post_schema.jsonify(postd)


@app.route('/delete_comment/<id>/', methods=['DELETE'])
def comment_delete(id):
    commentd = Comments.query.get(id)
    db.session.delete(commentd)
    db.session.commit()
    return post_schema.jsonify(commentd)


@app.route('/register', methods=['POST'])
def register_user():
    fullname = request.json['fullname']
    email = request.json['email']
    pwd = request.json['pwd']
    gender = request.json['gender']
    sec_ques = request.json['sec_ques']
    sec_ans = request.json['sec_ans']

    user_exists = Users.query.filter_by(email=email).first() is not None

    if user_exists:
        error = {"emailError": "*User with this email already exists"}
        return jsonify({"error": error}), 409

    hashed_pwd = bcrypt.generate_password_hash(pwd)
    new_user = Users(fullname, email, hashed_pwd, gender, sec_ques, sec_ans)

    db.session.add(new_user)
    db.session.commit()

    # session["user_id"] = new_user.id

    return jsonify({
        "success": "user registered with success!",
        "id": new_user.id
    }), 200


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json['email']
    pwd = request.json['pwd']

    user = Users.query.filter_by(email=email).first()

    if user is None:
        error = {"emailError": "*Email does not exist"}
        return jsonify({"error": error}), 401

    if not bcrypt.check_password_hash(user.pwd, pwd):
        error = {"pwdError": "*Incorrect password"}
        return jsonify({"error": error}), 401

    session["user_id"] = user.id

    return jsonify({
        "success": "user logged in with success!"
    }), 200

# This route was used for postman testing...........................
# This route was used for postman testing...........................
# This route was used for postman testing...........................


@app.route('/@me')
def current_user():
    uid = session["user_id"]
    if not uid:
        return jsonify({"error": "unauthorized"}), 401
    user = Users.query.filter_by(id=uid).first()
    return jsonify({
        "user": user.id
    }), 200
# This route was used for postman testing...........................
# This route was used for postman testing...........................
# This route was used for postman testing...........................


@app.route('/logout', methods=['POST'])
def logout_user():
    session.pop("user_id")
    return "200"


@app.route('/admin/delete_user/<id>/', methods=['DELETE'])
def user_delete(id):
    userd = Users.query.get(id)
    db.session.delete(userd)
    db.session.commit()
    return user_schema.jsonify(userd)


@app.route('/upload_pic/<id>', methods=['POST', 'GET'])
def upload_pic(id):
    if request.method == 'POST':
        file = request.files['file-input']
        user = Users.query.filter_by(id=id).first()
        # uii = base64.b64encode(user.uimg)
        # uii = uii.decode("UTF-8")
        # user.uimg = uii
        user.uimg = file.read()
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "state": "success"
        }), 200


if __name__ == "__main__":
    app.run(debug=True)


@app.route('/get_pendingPosts', methods=['GET'])
def get_pendingPosts():
    args = request.args
    categ = args.get('categ')
    li = []

    result = db.session.query(Users, Posts).join(Posts).filter(
        Posts.categ == categ, Posts.status == "pending").order_by(Posts.id.desc())

    for users, posts in result:

        if users.uimg is not None:
            uii = base64.b64encode(users.uimg)
            uii = uii.decode("UTF-8")
        obj = {
            "fullname": users.fullname,
            "user_id": users.id,
            "categ": posts.categ,
            "id": posts.id,
            "uimg": uii,
            "title": posts.title,
            "content": posts.content,
            "date": posts.date,
            "views": posts.views,
            "replies": posts.replies
        }
        li.append(obj)
    return (li), 200

@app.route('/approve_post/<id>/', methods=['PUT'])
def post_approve(id):
    postd = Posts.query.get(id)
    # title of post update
    postd.status = "Approved"
    db.session.commit()
    return post_schema.jsonify(postd)