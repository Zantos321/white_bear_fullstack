const deleteMemoryCardById = `
    DELETE FROM 
        memory_cards 
    WHERE 
        id = ?;
    `;
module.exports = deleteMemoryCardById;
