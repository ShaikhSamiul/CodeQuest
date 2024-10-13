from sqlalchemy import create_engine,Column,Integer,String,Boolean,ForeignKey,Text
from sqlalchemy.orm import declarative_base

engine = create_engine('mysql://root@localhost:3306/codequest')

Base = declarative_base()

class User(Base):
    __tablename__ = "User"
    
    username = Column(String,primary_key=True)
    password = Column(String(128),nullable=False)
    email = Column(String,nullable=False)
    total_score = Column(Integer ,default = 0)
    streak = Column(Integer,default = 0)
    notification = Column(Boolean,default = 0)
    
class Language(Base):
    __tablename__ = "language"
    
    language_id = Column(Integer,primary_key=True)
    language_description = Column(String(30))
    
    
class Difficulty(Base):
    __tablename__ = "difficulty"
    
    difficulty_id = Column(Integer,primary_key=True)
    difficulty_value = Column(String(30))
    points = Column(Integer)
    
class Question(Base):
    __tablename__ = "Question"
    
    question_id = Column(Integer,primary_key=True)
    question_title = Column(String(50), nullable=False)
    question_description = Column(Text, nullable=False)
    difficulty_id = Column(Integer,ForeignKey('difficulty.difficulty_id'))
    test_cases = Column(String)
    
    
class Solution(Base):
    __tablename__ = "Solution"
    solution_id = Column(Integer,primary_key=True)
    solution = Column(String,nullable=False)
    is_valid = Column(Boolean,default=False)
    username = Column(String,ForeignKey('User.username'))
    language_id = Column(Integer,ForeignKey('language.language_id'))
    question_id = Column(Integer, ForeignKey('Question.question_id'))
   
    

class Query(Base):
    __tablename__ = "Query"
    
    query_id = Column(Integer,primary_key=True)
    query = Column(String(30))
    username = Column(String,ForeignKey('User.username'))
    language_id = Column(Integer)
   
class Comment(Base):
    __tablename__ = "Comment"
    
    comment_id = Column(Integer,primary_key=True)
    query_id = Column(Integer,ForeignKey('Query.query_id'))
    username = Column(String,ForeignKey('User.username'))
    comment = Column(Text, nullable=False)	


     
class BaseModel(Base):
    __abstract__ = True
    # __allow_unmapped__ = True
    
    id = Column(Integer,primary_key=True)
    
class SolutionQuestion(Base):
    __tablename__ = "solution_question"
    
    question_id = Column(Integer,ForeignKey('Question.question_id'),primary_key=True)
    solution_id = Column(Integer,ForeignKey('Solution.solution_id'),primary_key=True)
    
Base.metadata.create_all(engine)