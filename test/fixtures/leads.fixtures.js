function mockDataInsertion(){ 
    return [
        {
            id: 2, 
            name: 'Thadeus', 
            email: 'tneely1@github.com', 
            phone: '827-119-0028', 
            last_contacted: '2020-12-03T06:00:00.000Z', 
            account_id: 1
        },
        {
            id: 4, 
            name: 'Krissie', 
            email: 'kgoodanew3@gov.uk', 
            phone: '623-498-3521', 
            last_contacted: '2020-12-03T06:00:00.000Z', 
            account_id: 1
        },
        {
            id: 5, 
            name: 'Torey', 
            email: 'tfrays4@dedecms.com',  
            phone: '882-944-5423', 
            last_contacted: '2020-12-03T06:00:00.000Z', 
            account_id: 1
        }
    ];
}

module.exports = { mockDataInsertion };