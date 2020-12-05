function mockAccountFixture() {
    return [
        {
            id: 1, 
            name: 'Josh', 
            email: 'josh@email.com',	
            password: 'password'
        },
        {
            id: 2, 
            name: 'Test user', 
            email: 'test@email.com',	
            password: 'password'
        }
    ];
}

module.exports = { mockAccountFixture };