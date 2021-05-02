App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
      $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petsRow1 = $('#petsRow1');
      var petsRow2 = $('#petsRow2');
      var petsRow3 = $('#petsRow3');
      var petsRow4 = $('#petsRow4');
      var petsRow5 = $('#petsRow5');
      var petsRow6 = $('#petsRow6');
      var petTemplate = $('#petTemplate');
      var sportsTemplate = $('#sportsTemplate');

      for (i = 0; i < 3; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }

      for (i = 3; i < 7; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow1.append(petTemplate.html());
      }

      for (i = 7; i < 12; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow2.append(petTemplate.html());
      }      
      
      for (i = 12; i < 17; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow3.append(petTemplate.html());
      } 

      for (i = 17; i < 22; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow4.append(petTemplate.html());
      }

      for (i = 22; i < 27; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow5.append(petTemplate.html());
      } 

      for (i = 27; i < 30; i++) {
        sportsTemplate.find('.panel-title').text(data[i].name);
        sportsTemplate.find('img').attr('src', data[i].picture);
        sportsTemplate.find('.pet-breed').text(data[i].breed);
        sportsTemplate.find('.pet-age').text(data[i].age);
        sportsTemplate.find('.pet-location').text(data[i].location);
        sportsTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow6.append(sportsTemplate.html());
      }

    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    await window.ethereum.enable();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("PPV.json", function(election) {
      App.contracts.PPV = TruffleContract(election);
      App.contracts.PPV.setProvider(App.web3Provider);

      return App.bindEvents();
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    return App.render();
  },

  render: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  handleAdopt: function(event) {
    console.log('hi');
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.PPV.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.rentVideo(petId, {from: account});
      }).then(function(result) {
        $(event.target).find('.pet-age').text('Rented: ' + adoptionInstance.videos(petId));
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
