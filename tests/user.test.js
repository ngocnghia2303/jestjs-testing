const request = require('supertest')
const app = require('../src/app.js')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should  signup a new user', async () => {
    const response = await request(app).post('/users').send({
        'name': 'Lucky_Boi',
        'email': 'nghia.do@ilotusland.com',
        'password': 'nghiadeptrai'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name: 'Lucky_Boi',
            email: 'nghia.do@ilotusland.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('nghiadeptrai')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: "nghiadeptrai"
    }).expect(401)
    //send off the request with bad credentials
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        }).expect(200)
})

test('Should not get profile for unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .send({})
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({})
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({})
        .expect(200)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'KimAnhTran',
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('KimAnhTran')
})


test('Should not update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Nui Thanh town'
        })
        .expect(400)
})
