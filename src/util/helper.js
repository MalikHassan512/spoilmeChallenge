import moment from 'moment'
export const fromNow=(time)=>{
      const fireBaseTime = new Date(
        time.seconds * 1000 + time.nanoseconds / 1000000,
      );
      return moment(fireBaseTime).fromNow();
}

export const chatFormat=(time,format)=>{
    const fireBaseTime = new Date(
      time.seconds * 1000 + time.nanoseconds / 1000000,
    );
    return moment(fireBaseTime).format(format);
}
