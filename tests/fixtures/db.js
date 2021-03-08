const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    '_id': userOneId,
    'name': 'Linda-HTV',
    'email': 'ngocty756@gmail.com',
    'password': 'nghiadeptrai',
    'tokens': [{
        'token': jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    '_id': userTwoId,
    'name': 'Kim Anh Tran',
    'email': 'ngocty657@gmail.com',
    'password': 'nghiadeptrai1',
    'tokens': [{
        'token': jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    '_id': new mongoose.Types.ObjectId(),
    'description': 'Read Book',
    'compelete': true,
    'owner': userOne._id
}

const taskTwo = {
    '_id': new mongoose.Types.ObjectId(),
    'description': 'XXX Porn',
    'compelete': false,
    'owner': userOne._id
}

const taskThree = {
    '_id': new mongoose.Types.ObjectId(),
    'description': 'Play soccer & basketball',
    'compelete': true,
    'owner': userTwo._id,
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userOneId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}