pragma solidity ^0.5.16;

contract PPV {

    mapping(uint => uint) public videos;

    uint public videosCount;

    constructor () public {
    }

    function rentVideo (uint _vidId) public {
        videos[_vidId] ++;
    }
}