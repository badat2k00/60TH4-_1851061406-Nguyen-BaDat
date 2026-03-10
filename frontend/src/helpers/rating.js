

function rating(...params) {
    const a = [0, 0, 0, 0, 0];
    for (let i = 0; i < params.length; i++) {
        if (params[i] === 1) {
            for (let j = 0; j <= i; j++) {
                a[j] = 1;
            }
        }
    }
    return a;
}

export default rating

