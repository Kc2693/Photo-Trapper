
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('photos').del()
    .then(function () {
      // Inserts seed entries
      return knex('photos').insert([
        {title: 'George Spilled His Beans', url: 'https://i.redditmedia.com/KcCthlN9a3uvYq11d3_Vsu13bJDCii1gNq5lF6ZVhIA.jpg?w=576&s=f3700a574628a3a5a4c1ba3546d517d6'},
        {title: 'Pink toebeans', url: 'https://i.redditmedia.com/CKvyH7mIUMo_CAt_n1RHpOWovVZjGsvd8_2ZaulhR6M.jpg?w=768&s=70182cf9a4752229b27f69c0a4e7aaee'},
        {title: 'Pippin has an accent toebean', url: 'https://i.redditmedia.com/eW8tGenjUCbMDfvmaJ1ckDAO3RSeG8jaGQGBR2ZNr14.jpg?w=576&s=a6fde3e46d1978a74f897cbbb6844f52'}
      ]);
    });
};
