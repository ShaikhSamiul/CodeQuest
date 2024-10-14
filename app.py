from flask import Flask, render_template, request, jsonify, redirect, url_for,session
from bcrypt import hashpw, checkpw, gensalt
import re
from pistonpy import PistonApp
import requests
import google.generativeai as genai
import os
from models import engine,User,Solution,Question,Query,Language,Difficulty,SolutionQuestion,Comment
from sqlalchemy.orm import sessionmaker
from flask_mysqldb import MySQL
from sqlalchemy import func
from abc import abstractproperty, ABC

import pymysql
pymysql.install_as_MySQLdb()

piston = PistonApp()
genai.configure(api_key="AIzaSyAhV_8PlrMYS4PjquhF0RqrshWMkke1jiI")
# genai.configure(api_key=os.environ.get("GENAI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
app = Flask(__name__)

app.secret_key = 'codequest'
Session = sessionmaker()
sql_session = Session(bind=engine)

# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = ''
# app.config['MYSQL_DB'] = 'codequest'
# app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST')
# app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER')
# app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD')
# app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB')
app.config['MYSQL_HOST'] = 'sql12.freesqldatabase.com'
app.config['MYSQL_USER'] = 'sql12737473'
app.config['MYSQL_PASSWORD'] = '3XTQfMGrDY'
app.config['MYSQL_DB'] = 'sql12737473'


mysql = MySQL(app)



# Other routes

@app.route('/')
def splash():
    return render_template('splash.html')


@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/leaderboard')
def leaderboard():
    users = sql_session.query(User).order_by(User.total_score.desc()).limit(10).all()
    
    return render_template('leaderboard.html', users=users)

@app.route('/questions', methods=['POST', 'GET'])
def questions():
    if "user" not in session:
        return redirect(url_for('info'))
    # cursor = mysql.connection.cursor()
    # cursor.execute(
    #     ''' SELECT a.*,b.difficulty_value FROM question as a,difficulty as b where a.difficulty_id = b.difficulty_id; ''')
    # results = cursor.fetchall()

    questions = sql_session.query(Question,Difficulty).join(Difficulty,Difficulty.difficulty_id == Question.difficulty_id).all()

    return render_template('questions.html', questions=questions)


@app.route('/discussions', methods=['POST', 'GET'])
def discussions():
    if "user" not in session:
        return redirect(url_for('info'))
    # cursor = mysql.connection.cursor()
    # cursor.execute(
    #     '''SELECT q.* FROM query as q,languages as b where q.language_id = b.language_id;''')
    # results =cursor.fetchall()

    queries = sql_session.query(Query).all()
    return render_template('discussions.html', queries=queries)

@app.route('/comments/<int:query_id>')
def comments(query_id):
    if "user" not in session:
        return redirect(url_for('info'))

    query = sql_session.query(Query).filter_by(query_id = query_id).first()
    if (query.username == session["user"]):
        asker = True
    else:
        asker = False
    comments = sql_session.query(Comment).filter_by(query_id = query_id).all()
    return render_template('comments.html', query=query,comments= comments,queryId = query.query_id, asker=asker)

@app.route('/compiler/<int:question_id>')
def compiler(question_id):
    if "user" not in session:
        return redirect(url_for('info'))
    
    existing_code = sql_session.query(Solution).filter_by(question_id = question_id, username = session["user"]).first()
    if existing_code:
        code = existing_code.solution
    else:
        code =""
    
    # cursor = mysql.connection.cursor()
    # cursor.execute(''' SELECT question_title, question_description FROM question WHERE question_id = %s ''', (question_id,))
    # result = cursor.fetchone()
    # If question is not found
    # if not result:
    
    question = sql_session.query(Question).filter_by(question_id = question_id).first()
    if not question:
        return "Question not found", 404
    
    return render_template('compile.html', title=question.question_title, description=question.question_description,qID=question_id, code=code)  # Pass the title to the template


@app.route('/profile')
def profile():
    if "user" not in session:
        return redirect(url_for('info'))
    answeredQuestions = sql_session.query(func.count(Solution.solution_id)).filter_by(username=session['user']).scalar()
    users = sql_session.query(User).order_by(User.total_score.desc()).limit(10).all()
    email = sql_session.query(User).filter_by(username=session["user"]).first().email
    score = sql_session.query(User).filter_by(username=session["user"]).first().total_score
    
    
    return render_template('profile.html',users=users, email=email, score=score, answeredQuestions=answeredQuestions)


@app.route('/signup', methods=['POST'])
def signup():
    
    if request.method == "POST":
        uname = request.form["username"]
        
        # cursor = mysql.connection.cursor()
        # cursor.execute('SELECT COUNT(*) FROM user WHERE username = %s', (uname,))
        # result = cursor.fetchone()
        user = sql_session.query(User).filter_by(username=uname).first()
        if user:
            return jsonify(success=False, message='Username already exists'), 401
        
        pwd = request.form["password"]
        confirm_pwd = request.form["cnf-password"]
        email = request.form["email"]
        
        username_pattern = r"^[a-zA-Z0-9_.]+$"
        if re.match(username_pattern, uname) is None:
            return jsonify(success=False, message='The username should only contain alphanumeric, _(underscore) or .(periods)'), 401
        
        email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(email_pattern, email) is None:
            return jsonify(success=False, message='Invalid email'), 401
        
        # cursor.execute('SELECT COUNT(*) FROM user WHERE email = %s', (email,))
        # result = cursor.fetchone()
        # if result[0] > 0:
        user = sql_session.query(User).filter_by(email=email).first()
        if user:
            return jsonify(success=False, message='Email already exists'), 401

        password_pattern = r'^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$'
        if re.match(password_pattern, pwd) is None:
            return jsonify(success=False, message='Password should be at least 8 characters long and contain at least one letter, one number, and one special character'), 401
        
        if pwd != confirm_pwd:
            return jsonify(success=False, message='Passwords do not match'), 401
        
        # cursor.execute(''' INSERT INTO user VALUES(%s,%s,%s,0,0,0) ''', (uname, hashed_pwd, email))
        # mysql.connection.commit()
        # cursor.close()
        
        hashed_pwd = hashpw(pwd.encode('utf-8'), gensalt())
        user = User(username = uname , password = hashed_pwd , email = email)
        sql_session.add(user)
        sql_session.commit()
        
        session["user"] = uname
        return jsonify(success=True, redirect='/questions'), 200
    else:
        return jsonify(success=False, message='Unable to register'), 401


@app.route('/login', methods=['POST'])
def login():
    
    if request.method == "POST":
        uname = request.form["username"]
        pwd = request.form["password"]
        # cursor = mysql.connection.cursor()
        # cursor.execute("SELECT * FROM user WHERE username = %s ", (uname,))
        # user = cursor.fetchone()
        # print(user)
        user = sql_session.query(User).filter_by(username=uname).first()
        if (user):
            if checkpw(pwd.encode('utf-8'),user.password.encode('utf-8')):
                session["user"] = uname
                return jsonify(success=True, redirect='/questions'), 200
            else:
                return jsonify(success=False, message='Invalid email or password'), 401
        else:
            return jsonify(success=False, message='Invalid account'), 401

    else:
        return render_template('login.html')

@app.route('/logout')
def logout():
    if "user" in session:
        session.pop("user")
    session.clear()
    return redirect(url_for('info', logout='success'))



@app.route('/submitQuery', methods=['POST'])
def submitQuery():
    
    if request.method == "POST":
        uname = session["user"]
        text = request.form.get('query')
        language_id = request.form.get('language')
        
        # cursor = mysql.connection.cursor()
        # cursor.execute(''' INSERT INTO query VALUES('',%s,%s,%s) ''', (uname,text,language_id))
        # mysql.connection.commit()
        # cursor.close()

        query = Query(query=text,username=uname,language_id=language_id)
        sql_session.add(query)
        sql_session.commit()
        return redirect(url_for('discussions'))
    else:
        return jsonify(success=False, message='Unable to post query'), 401

@app.route('/compile', methods=['POST'])
def compile_code():
    if "user" not in session:
        return redirect(url_for('info'))
    data = request.json
    code = data.get('code', '')
    language = data.get('language', 'python')
    

    # Piston API URL
    piston_url = "https://emkc.org/api/v2/piston/execute"

    # API payload
    payload = {
        "language": language,
        "version": "*",  # Latest version of the language
        "files": [{"name": "code", "content": code}]   
    }

    try:
        # Make the API request
        response = requests.post(piston_url, json=payload)
        response_data = response.json()

        # Extract output from API response
        if 'run' in response_data:
            output = response_data['run']['stdout'] + response_data['run']['stderr']
        else:
            output = "No output generated or execution failed."

    except Exception as e:
        output = f"An error occurred: {str(e)}"

    return jsonify({"output": output})

@app.route('/submitCode', methods=['POST'])
def submitCode():
    if "user" not in session:
        return redirect(url_for('info'))
    data = request.json
    code = data.get('code', '')
    language = data.get('language', 'python')
    question = data.get('question', '')
    response = model.generate_content(f"""
                                  
        Question: {question}
        Language: {language}
        Solution: {code}
        
        Answer in this format (Don't add anything, start with curly braces and end the response with curly braces) and strictly follow that format:
        {{
        "isTrue": "Is this correct? Answer in \"Yes\" or \"No\"? no full stop at the end"
        "hint": "If No, What's wrong in this? Give answer as short as possible and just give me the hint about that not the actual answer."
        }}

    """)

    return jsonify(response.text)

@app.route('/submitSolution', methods=['POST'])
def submitSolution():
    if 'user' not in session:
        return redirect(url_for('info'))
    data = request.json
    code = data.get('code', '')
    language = data.get('language', '')
    question = data.get('question', '')
    question_id = int(data.get('question_id',''))
    
     
    # cursor = mysql.connection.cursor()
    # cursor.execute(''' INSERT INTO solution VALUES('', %s, 'true', %s, %s) ''', (code, session['user'], language))
    # solution_id = cursor.lastrowid
    # cursor.execute(''' SELECT question_id FROM question WHERE question_title LIKE %s; ''', ('%' + question + '%',))
    # question_id = cursor.fetchone()
    # cursor.execute(''' INSERT INTO solution_question VALUES(%s, %s) ''', (question_id[0], solution_id))
    # mysql.connection.commit()
    # cursor.close()
    
    # question_username = sql_session.query(SolutionQuestion,Solution).join(SolutionQuestion,Solution.solution_id==SolutionQuestion.solution_id).all()
    existingSolution = sql_session.query(Solution).filter_by(question_id = question_id, language_id = language, username = session["user"]).first()
    if existingSolution:
        existingSolution.solution = code  # Update the solution code
        existingSolution.is_valid = True  # Update the validity status
        sql_session.commit()  # Commit the changes
        return jsonify(success=True, message="Solution updated successfully", redirect='/questions'), 200
    else:
    
    
        solution = Solution(solution = code,is_valid = True,username = session['user'],language_id = language, question_id=question_id)
        sql_session.add(solution)
        sql_session.flush() 

        
        question = sql_session.query(Question,Difficulty).join(Question,Difficulty.difficulty_id == Question.difficulty_id).filter_by(question_id = question_id ).first()
        
        points = question[1].points
        user = sql_session.query(User).filter_by(username=session["user"]).first()
        
        # for solution_question, solution in question_username:
        #     if not (solution_question.question_id == question[0].question_id and solution.username == session["user"]):
        #         user.total_score += points

        if(solution.is_valid):
            user.total_score += points

        sql_session.commit()    
        
        return jsonify(success=True, redirect='/questions'), 200

@app.route('/check-username', methods=['GET'])
def check_username():
    uname = request.args.get('username')
    
    # cursor = mysql.connection.cursor()
    # cursor.execute('SELECT COUNT(*) FROM user WHERE username = %s', (uname,))
    # result = cursor.fetchone()
    # cursor.close()
    # if result[0] > 0:
    user = sql_session.query(User).filter_by(username=uname).first()
    if (user):
        return jsonify(available=False)
    else:
        return jsonify(available=True)
    
@app.route('/check-email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    # cursor = mysql.connection.cursor()
    # cursor.execute('SELECT COUNT(*) FROM user WHERE email = %s', (email,))
    # result = cursor.fetchone()
    # cursor.close()
    email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    
    user = sql_session.query(User).filter_by(email = email).first()
    if (user):
        return jsonify(available=False, message='Email already exists')
    elif re.match(email_pattern, email) is None:
        return jsonify(success=False, message='Invalid Email')
    else:  
        return jsonify(available=True)
    
@app.route('/sendComment', methods=['GET','POST'])  
def sendComment():
    data = request.json
    comment = data.get('comment', '')
    query_id = data.get('query_id', '')
    
    c = Comment(query_id=query_id,username=session["user"],comment=comment)
    sql_session.add(c)
    sql_session.commit()
    
    return jsonify(success=True, redirect='/questions'), 200

@app.route('/validatePassword', methods=['POST'])
def validatePassword():
    if request.method == "POST":
        pwd = request.form.get('password')
        user = sql_session.query(User).filter_by(username=session["user"]).first()
        if checkpw(pwd.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify(success=True)
        else:
            return jsonify(success=False, message='Invalid password'), 401

@app.route('/saveDetails', methods=['POST'])
def saveDetails():
    if request.method == "POST":
        uname = request.form["username"]
        pwd = request.form["password"]
        email = request.form["email"]
        confirm_pwd = request.form["confirmPassword"]
        
        
        user = sql_session.query(User).filter_by(username=uname).first()
        if user:
            return jsonify(success=False, message='Username already exists'), 401
        
        existing_user = sql_session.query(User).filter_by(username=session['user']).first()
        if uname == "":
            uname = existing_user.username
        
        
        
        
        
        
        # cursor.execute('SELECT COUNT(*) FROM user WHERE email = %s', (email,))
        # result = cursor.fetchone()
        # if result[0] > 0:
        user = sql_session.query(User).filter_by(email=email).first()
        if user:
            return jsonify(success=False, message='Email already exists'), 401
        
        if email == "":
            email = existing_user.email
        
        username_pattern = r"^[a-zA-Z0-9_.]+$"
        if re.match(username_pattern, uname) is None:
            return jsonify(success=False, message='The username should only contain alphanumeric, _(underscore) or .(periods)'), 401
        
        email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(email_pattern, email) is None:
            return jsonify(success=False, message='Invalid email'), 401
        
        password_pattern = r'^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$'
        if re.match(password_pattern, pwd) is None:
            return jsonify(success=False, message='Password should be at least 8 characters long and contain at least one letter, one number, and one special character'), 401
        
        if pwd != confirm_pwd:
            return jsonify(success=False, message='Passwords do not match'), 401
        
        # cursor.execute(''' INSERT INTO user VALUES(%s,%s,%s,0,0,0) ''', (uname, hashed_pwd, email))
        # mysql.connection.commit()
        # cursor.close()
        
        hashed_pwd = hashpw(pwd.encode('utf-8'), gensalt())
        #update query
        sql_session.query(User).filter_by(username=session["user"]).update({"username": uname, "password": hashed_pwd, "email": email})
        sql_session.commit()
        session["user"] = uname
        return jsonify(success=True, redirect='/profile'), 200
    else:
        return jsonify(success=False, message=''), 401
        
@app.route('/existingSolution', methods=['POST'])
def existingSolution():
    if request.method == "POST":
        data = request.json
        language_id = data.get('language', '')
        if language_id == 'python':
            language_id = 1
        elif language_id == 'java':
            language_id = 2
        else:
            language_id = 3
        
        question_id = int(data.get('question_id',''))
        existing_code = sql_session.query(Solution).filter_by(language_id = language_id,question_id = question_id, username = session["user"]).first()
        
        if existing_code is not None:
            code = existing_code.solution
            print(f"Existing solution: {code}")
        else:
            code =""
        
        return jsonify(success=True, solution=code)
        
@app.route('/existingSolutionOnload', methods=['POST'])
def existingSolutionOnload():
    if request.method == "POST":
        data = request.json
        language_id = 1
        
        question_id = int(data.get('question_id',''))
        existing_code = sql_session.query(Solution).filter_by(language_id = language_id,question_id = question_id, username = session["user"]).first()
        print(existing_code)
        if existing_code is not None:
            code = existing_code.solution
            
        else:
            code =""
        
        return jsonify(success=True, solution=code)
      
@app.route('/deleteQuery', methods=['POST'])
def deleteQuery():
    if request.method == "POST":
        data = request.json
        query_id = data.get('query_id', '')
        sql_session.query(Query).filter_by(query_id=query_id).delete()
        sql_session.commit()
        return jsonify(success=True), 200
    else:
        return jsonify(success=False), 401

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return an empty response with HTTP status 204 (No Content)


if __name__ == '__main__':
    app.run(port=3000, debug=True)



