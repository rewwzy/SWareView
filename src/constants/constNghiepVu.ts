export type TrangThaiType = {
    value: number;
    displayValue: string;
}



export const DSTrangThai : TrangThaiType[] = [
    {
        value: 0,
        displayValue: 'Chưa hoàn thành'
    },
    {
        value:1,
        displayValue:'Hoàn thành'
    },
    {
        value:2,
        displayValue:'Đề nghị hủy bỏ'
    },
    {
        value:3,
        displayValue:'Chưa rõ nội dung'
    },
    {
        value:4,
        displayValue:'Thực hiện'
    }
]
