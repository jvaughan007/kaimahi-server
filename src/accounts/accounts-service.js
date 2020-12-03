const AccountsService = {
    checkIfUserExists(knex, email) {
        return knex.select('*').from('accounts').where('email', email).first();
    },
    createNewAccount(knex, data) {
        return knex
            .insert(data)
            .into('accounts')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    fetchLeadsOfCurrentUserAccount(knex, account_id) {
        return knex
            .select('*')
            .from('leads')
            .where('account_id', account_id);
    },
};

module.exports = AccountsService;
