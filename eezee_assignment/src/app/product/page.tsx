"use client"
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { message } from 'antd'

export default function ProductPage() {
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage()
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'No product selected',
        })
    }
    
    const firstRun = useRef(true)

    useEffect(() => {
        if (firstRun.current) {
            error()
            firstRun.current = false
        }
        const timer = setTimeout(() => {
            messageApi.destroy()
            router.push('/')
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>{contextHolder}</>
    )
}