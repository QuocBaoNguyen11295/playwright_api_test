import { test, expect } from '@playwright/test';

test.describe('Login and access booking list', () => {
    [
        { username: 'Alice', pwd: 'admin', statuscode: 200 },
        { username: 'Bob', pwd: 'admin2', statuscode: 200 },
        { username: '', pwd: 'admin', statuscode: 200 },
        { username: 'Alice', pwd: '', statuscode: 403 }
    ].forEach(({ username, pwd, statuscode }) => {
        var username_replace = username === '' ? "None" : username
        var password_replace = pwd === '' ? "None" : pwd
        test(`Login to the App with username is ${username_replace} and password is ${password_replace}`, async ({ request }) => {
            const res = await request.post('https://restful-booker.herokuapp.com/auth', {
                data: {
                    "username": username,
                    "password": pwd
                }
            })
            expect(res.status()).toBe(statuscode)
            expect(res.token).not.toBe(null)
        });
    })
    test('Get all booking list', async ({ request }) => {
        const res = await request.get("https://restful-booker.herokuapp.com/booking")
        expect(res.status()).toBe(200)
        const data = await res.json()
        expect(data.length).toBeGreaterThanOrEqual(1000)
    })

    test('The user tries to filter by name but not found', async ({ request }) => {
        const res = await request.get("https://restful-booker.herokuapp.com/booking?firstname=sally")
        const data = await res.json()
        expect(res.status()).toBe(200)
        expect(data.length).toEqual(0)
    })

    test('The user tries to filter by name and found', async ({ request }) => {
        const res = await request.get("https://restful-booker.herokuapp.com/booking?firstname=Susan")
        const data = await res.json()
        expect(res.status()).toBe(200)
        expect(data.length).toBeGreaterThan(0)
    })

    test('The user tries to access the book by its id', async ({ request }) => {
        const res = await request.get(`https://restful-booker.herokuapp.com/booking/1`)
        const data = await res.json()
        expect(res.status()).toBe(200)
        expect(data.firstname).not.toBeUndefined
        expect(data.lastname).not.toBeUndefined
        expect(data.totalprice).not.toBeUndefined
    })
});