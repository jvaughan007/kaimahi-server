const LeadsService = {
    getAllLeads(knex) {
        return knex.select('*').from('leads');
    },
    getById(knex, id) {
        return knex.from('leads').select('*').where('id', id).first();
    },
    insertLead(knex, newLead) {
        return knex
            .insert(newLead)
            .into('leads')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    deleteLead(knex, id) {
        return knex('leads')
            .where({ id })
            .delete();
    },
    updateLead(knex, id, newLeadsFields) {
        return knex('leads')
            .where({ id })
            .update(newLeadsFields);
    },
};

module.exports = LeadsService;