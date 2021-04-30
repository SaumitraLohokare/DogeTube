pragma solidity ^0.5.16;

contract PPV {

    struct Video {
        uint rentCount;
    }

    mapping(uint => Video) public videos;

    uint public videosCount;

    constructor () public {
    }

    function rentVideo (uint _vidId) public {
        videos[_vidId].rentCount ++;
    }
}