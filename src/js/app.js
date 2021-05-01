App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < 10; i ++) {
        petTemplate.find('.panel-title').text('Movie ' + i);
        petTemplate.find('.pet-breed').text('Genre');
        petTemplate.find('.pet-age').text('Rented: ');
        petTemplate.find('.pet-location').text('Director...');
        petTemplate.find('.btn-adopt').attr('data-id', i);

        petsRow.append(petTemplate.html());
      }

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
