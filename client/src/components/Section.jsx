import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Rating from './Rating'

const Section = ({ title, items, togglePop }) => {

    return (
        <>
            <div className="cards__section">
                <h3 id={title}>{title}</h3>
                <hr />

                <div className="cards">
                    {items.map((item, index) => (
                        <div className="card" key={index} onClick={() => togglePop(item)}>
                            <div className="card__image">
                                <img src={item.image} alt="Item" />
                            </div>
                            <div className="card__info">
                                <h4>{item.name}</h4>
                                <Rating value={item.rating} />
                                {/* <p>{ethers.parseEther(item.cost.toString(), 'ether')} ETH</p> */}
                                <p>{ethers.formatEther(item.cost.toString(), 'ether')} ETH</p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>

    );
}

export default Section;