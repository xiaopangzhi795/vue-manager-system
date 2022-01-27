import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


export const calculateData = query => {
    return request({
        url: './calculate.json',
        method: 'get',
        params: query
    });
};