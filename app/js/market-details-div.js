showMarketDetailsDiv = () => {
    hideAllDivs()
    resetMarketDetailsDiv()
    $('#market-details-div').append(`
    <div style="text-align: center;">
        <h2>Market Details</h2>
    </div>
    <div class="mt-4" style="width: 100%">
        <table class="table table-bordered table-dark market-details-table" style="color: #ffffff;text-align: center;">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Pending Amount</th>
                    <th scope="col">11 Kg Chenab</th>
                    <th scope="col">15 Kg Chenab</th>
                    <th scope="col">45 Kg Chenab</th>
                    <th scope="col">11 Kg Super</th>
                    <th scope="col">15 Kg Super</th>
                    <th scope="col">45 Kg Super</th>
                </tr>
            </thead>
            <tbody id="view-market-details-table">                                       
            </tbody>
        </table>
    </div>
    `)
    generateMarketTable()
    $('#market-details-div').css('display', 'flex')
}

resetMarketDetailsDiv = () => {
    $('#market-details-div').html(``)
}

generateMarketTable = () => {

    getAllCustomersWithPendingAmount((err, data) => {

        for(let i = 0; i < data.length; i++) {
            $(`#view-market-details-table`).append(`
                <tr id="market-detail-customer-${i}" style="font-weight: bold; font-size: 17px;"><tr>
            `)
            let record = {
                'company_name': '--',
                'customer_name': '--',
                'limit': '--',
                'total_pending_amount': '--',
                '11_kg_cylinders_chenab': '--',
                '15_kg_cylinders_chenab': '--',
                '45_kg_cylinders_chenab': '--',
                '11_kg_cylinders_super': '--',
                '15_kg_cylinders_super': '--',
                '45_kg_cylinders_super': '--'
            }
            getNumberOfCylindersinPossesion(data[i].customer_id, 11, (err,num)=>{
                if(num[0] != undefined) {
                    if(num[0].plant_id === 1) {
                        record['11_kg_cylinders_chenab'] = num[0].number_of_cylinders
                    }
                    if(num[0].plant_id === 2) {
                        record['11_kg_cylinders_super'] = num[0].number_of_cylinders
                    }
                }
                if(num[1] != undefined) {
                    if(num[1].plant_id === 1) {
                        record['11_kg_cylinders_chenab'] = num[1].number_of_cylinders
                    }
                    if(num[1].plant_id === 2) {
                        record['11_kg_cylinders_super'] = num[1].number_of_cylinders
                    }
                }

                getNumberOfCylindersinPossesion(data[i].customer_id, 15, (err,num)=>{
                    if(num[0] != undefined) {
                        if(num[0].plant_id === 1) {
                            record['15_kg_cylinders_chenab'] = num[0].number_of_cylinders
                        }
                        if(num[0].plant_id === 2) {
                            record['15_kg_cylinders_super'] = num[0].number_of_cylinders
                        }
                    }
                    if(num[1] != undefined) {
                        if(num[1].plant_id === 1) {
                            record['15_kg_cylinders_chenab'] = num[1].number_of_cylinders
                        }
                        if(num[1].plant_id === 2) {
                            record['15_kg_cylinders_super'] = num[1].number_of_cylinders
                        }
                    }

                    getNumberOfCylindersinPossesion(data[i].customer_id, 45, (err,num)=>{
                        if(num[0] != undefined) {
                            if(num[0].plant_id === 1) {
                                record['45_kg_cylinders_chenab'] = num[0].number_of_cylinders
                            }
                            if(num[0].plant_id === 2) {
                                record['45_kg_cylinders_super'] = num[0].number_of_cylinders
                            }
                        }
                        if(num[1] != undefined) {
                            if(num[1].plant_id === 1) {
                                record['45_kg_cylinders_chenab'] = num[1].number_of_cylinders
                            }
                            if(num[1].plant_id === 2) {
                                record['45_kg_cylinders_super'] = num[1].number_of_cylinders
                            }
                        }

                        record['company_name'] = titleCase(data[i].company_name)
                        if(data[i].customer_name != null) {
                            record['customer_name'] = data[i].customer_name
                        }
                        record['total_pending_amount'] = data[i].total_pending_amount
                        record['limit'] = data[i].limit
                        let color
                        if(data[i].total_pending_amount >= data[i].limit) {
                            color = 'red'
                        }
                        else {
                            color = 'white'
                        }
                        $(`#market-detail-customer-${i}`).append(`
                            <td>${i + 1}</td>
                            <td>${record['company_name']}</td>
                            <td>${record['customer_name']}</td>
                            <td>${record['total_pending_amount']}</td>
                            <td>${record['11_kg_cylinders_chenab']}</td>
                            <td>${record['15_kg_cylinders_chenab']}</td>
                            <td>${record['45_kg_cylinders_chenab']}</td>
                            <td>${record['11_kg_cylinders_super']}</td>
                            <td>${record['15_kg_cylinders_super']}</td>
                            <td>${record['45_kg_cylinders_super']}</td>
                        `)
                        $(`#market-detail-customer-${i}`).css('color', color)
                    })
                })
            })




        }

    })
}