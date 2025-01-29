import os
from sqlalchemy import create_engine,Column,Integer,String,Boolean,ForeignKey,Text
from sqlalchemy.orm import declarative_base

# Fetch environment variables set in Vercel
DATABASE_URL = os.getenv("DATABASE_URL")

# engine = create_engine('mysql+pymysql://root@localhost:3306/codequest')
# engine = create_engine('mysql+pymysql://sql12737473:3XTQfMGrDY@sql12.freesqldatabase.com/sql12737473')
# engine = create_engine('mysql+pymysql://samiul:SamVarsha2418@mysql-samiul.alwaysdata.net/samiul_codequest')
engine = create_engine(DATABASE_URL)

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    
    username = Column(String(30),primary_key=True)
    password = Column(String(128),nullable=False)
    email = Column(String(45),nullable=False)
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
    __tablename__ = "question"
    
    question_id = Column(Integer,primary_key=True)
    question_title = Column(String(50), nullable=False)
    question_description = Column(Text, nullable=False)
    difficulty_id = Column(Integer,ForeignKey('difficulty.difficulty_id'))
    test_cases = Column(String(255))
    
    
class Solution(Base):
    __tablename__ = "solution"
    solution_id = Column(Integer,primary_key=True)
    solution = Column(String,nullable=False)
    is_valid = Column(Boolean,default=False)
    username = Column(String,ForeignKey('user.username'))
    language_id = Column(Integer,ForeignKey('language.language_id'))
    question_id = Column(Integer, ForeignKey('question.question_id'))
   
    

class Query(Base):
    __tablename__ = "query"
    
    query_id = Column(Integer,primary_key=True)
    query = Column(String(30))
    username = Column(String,ForeignKey('user.username'))
    language_id = Column(Integer)
   
class Comment(Base):
    __tablename__ = "comment"
    
    comment_id = Column(Integer,primary_key=True)
    query_id = Column(Integer,ForeignKey('query.query_id'))
    username = Column(String,ForeignKey('user.username'))
    comment = Column(Text, nullable=False)	


     
class BaseModel(Base):
    __abstract__ = True
    # __allow_unmapped__ = True
    
    id = Column(Integer,primary_key=True)
    
class SolutionQuestion(Base):
    __tablename__ = "solution_question"
    
    question_id = Column(Integer,ForeignKey('question.question_id'),primary_key=True)
    solution_id = Column(Integer,ForeignKey('solution.solution_id'),primary_key=True)
    
# Base.metadata.create_all(engine)