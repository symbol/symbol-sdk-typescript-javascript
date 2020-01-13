export const timeZoneListData = (() => {
  let list = [
    {
      value: 0,
      label: 'GMT',
    },
  ]
  for (let i = 1; i <= 12; i ++) {
    list.push({
      value: i,
      label: `GMT+${i}`,
    })
    list.push({
      value: -i,
      label: `GMT-${i}`,
    })
  }
  list = list.sort()
  return list
})()
