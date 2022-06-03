import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Link, ETHTokenType } from '@imtbl/imx-sdk'
import React, { useState, useEffect } from 'react'
import Transfer from "./components/Transfer";

const Home = () => {
    return (
        <div className={styles.container}>
            <Transfer />
        </div>
    )
}

export default Home;
