// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DAmazon {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require (owner==msg.sender,"Only Owner Can Perform This Operation!");
        _;
    }

    struct Product {
        uint id;
        string name;
        string category;
        string image;
        uint cost;
        uint rating;
        uint stock;
    }
    event listed(string name, uint cost, uint quantity, bool success);
    mapping(uint => Product) public products;

    function listProducts(
        uint _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint _cost,
        uint _rating,
        uint _stock
    ) public onlyOwner{
        require(_id >= 0);
        // require(msg.sender == owner, "only owner can list the products"); // used modifier in place of this
        Product memory product = Product(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        products[_id] = product;
        emit listed(_name, _cost, _stock, true);
    }

    struct Order{
        uint time;
        Product product;
    }

    mapping(address=>mapping(uint=>Order)) public orders; //(user=>(orderNo,Order));  
    mapping(address=>uint) public orderCount;

    event buy(address buyer,uint orderId,uint itemId);

    function buyProducts(uint _id) public payable{   // by just using payable you can now send ethers to contract
        require(_id>=0);
        require(msg.value>=products[_id].cost && products[_id].stock>0);
        
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = Order(block.timestamp , products[_id]);
        products[_id].stock--;
        emit buy(msg.sender,orderCount[msg.sender],products[_id].id);
    }

    // struct Order{
    //     uint time;
    //     Product product;
    //     uint quantity;
    // }
    // function buyProducts(uint _id , _quantity) public payable{   // by just using payable you can now send ethers to contract
    //     require(_id>=0);
    //     require(msg.value>=products[_id].cost && products[_id].stock>=_quantity);
    //     orderCount[msg.sender]++;
    //     orders[msg.sender][orderCount[msg.sender]] = Order(block.timestamp , products[_id],_quantity);
    //     products[_id].stock = products[_id].stock - _quantity;
    // }

    function withdraw() public onlyOwner{
        (bool success,) = owner.call{value:address(this).balance}(""); // call function returns a promsie with two variables
        require(success); 
    }
}
