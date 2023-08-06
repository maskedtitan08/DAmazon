import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Rating from './Rating';
import close from '../assets/close.svg'

const Product = ({ item, provider, account, contract, togglePop }) => {
    // const [order, setOrder] = useState(null)
    // const [hasBought, setHasBought] = useState(false)

    // // unanble to understand this function it is some standard way
    // const fetchDetails = async () => {
    //     const fromBlock = 'latest';
    //     const toBlock = 'latest'; // Adjust the range as needed
    //     const events = await contract.queryFilter("buy", {
    //         fromBlock,
    //         toBlock,
    //     })
    //     const orders = events.filter(
    //         (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    //     )

    //     if (orders.length === 0) return

    //     const order = await contract.orders(account, orders[0].args.orderId)
    //     setOrder(order)
    // }
    const [order, setOrder] = useState(null);
    const [hasBought, setHasBought] = useState(false);

    const fetchDetails = async () => {
        const orderBlockRange = 10000n; // Adjust the block range as needed
        const orderId = await contract.orderCount(account); // Replace with the actual order ID you want to retrieve
        const order = await contract.orders(account, orderId);
        const orderTime = order.time;
        console.log(orderTime);

        const fromTimeStamp = Number(orderTime) - Number(orderBlockRange);
        const toTimeStamp = Number(orderTime) + Number(orderBlockRange);
        const fromBlock = await provider.getBlockNumber(fromTimeStamp);
        const toBlock = await provider.getBlockNumber(toTimeStamp);
        const orderBlock = await provider.getBlockNumber(orderTime);
        console.log(orderBlock);

        const events = await contract.queryFilter('buy', {
            fromBlock,
            toBlock,
        });

        const userOrders = events.filter(
            (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
        );

        if (userOrders.length === 0) return;

        setOrder({
            orderId,
            orderTime,
        });
    };

    const buyHandler = async () => {
        const signer = await provider.getSigner()

        // Buy item...
        let transaction = await contract.connect(signer).buyProducts(item.id, { value: item.cost })
        // let transaction = await contract.buyProducts(item.id);
        await transaction.wait()

        setHasBought(true)
    }

    useEffect(() => {
        fetchDetails()
    }, [hasBought])



    return (
        <>
            <div className="product">
                <div className="product__details">
                    <div className="product__image">
                        <img src={item.image} alt="Product" />
                    </div>
                    <div className="product__overview">
                        <h2>{item.name}</h2>
                        <Rating value={item.rating} />
                        <hr />
                        {/* <h2>{ethers.parseEther(item.cost.toString(), 'ether')} ETH</h2> */}
                        <h2>{ethers.formatEther(item.cost.toString(), 'ether')} ETH</h2>
                        <h2>Overview</h2>
                        <p>
                            {item.description}
                        </p>

                    </div>
                    <div className="product__order">
                        {/* <h2>{ethers.parseEther(item.cost.toString(), 'ether')} ETH</h2> */}
                        <h2>{ethers.formatEther(item.cost.toString(), 'ether')} ETH</h2>
                        <p>
                            FREE delivery <br />
                            <strong>
                                {/* setting time that when will user get the delivery */}
                                {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </strong>
                        </p>

                        {item.stock > 0 ? (
                            <p>In Stock.</p>
                        ) : (
                            <p>Out of Stock.</p>
                        )}

                        <button className='product__buy' onClick={buyHandler}>
                            Buy Now
                        </button>

                        <p><small>Ships from</small> DAmazon</p>
                        <p><small>Sold by</small> DAmazon</p>

                        {order && (
                            <div className='product__bought'>
                                Item bought on <br />
                                <strong>
                                    {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                                        undefined,
                                        {
                                            weekday: 'long',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric'
                                        })}
                                </strong>
                            </div>
                        )}
                    </div>
                    <button onClick={togglePop} className="product__close">
                        <img src={close} alt="Close" />
                    </button>

                </div>
            </div>
        </>
    );
}

export default Product;