var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer')

router.post('/submit_product_details', upload.any(), function (req, res) {
    try {
        console.log("Received Data:", req.body);
        console.log("Received Files:", req.files);

        // Separate images and PDFs
        var imageFiles = req.files.filter(file => file.mimetype.startsWith("image/")).map(file => file.originalname);
        var pdfFile = req.files.find(file => file.mimetype === "application/pdf")?.originalname || "";
        console.log("aaaaaaaaaaa",pdfFile)
        pool.query('INSERT INTO productdetails (productid, brandid, categoryid, modelno, description, color, price, offerprice, shopkeepername, stock, status, hsncode, picture, pdf, warrantyyears, date, receivingdate, returndate,signature,signatures) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.productid, req.body.brandid, req.body.categoryid, req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.shopkeepername, req.body.stock, req.body.status, req.body.hsncode, imageFiles.join(","), req.files[0].filename, req.body.warrantyyears, req.body.date, req.body.receivingdate, req.body.returndate,req.body.signature,req.body.signatures], 
            function (error, result) {
                if (error) {
                    console.log("Database Error:", error);
                    res.json({ status: false, message: 'Database Error!' });
                } else {
                    console.log("Insert Success:", result);
                    res.json({ status: true, message: 'Product Details added successfully!' });
                }
            });
    }
    catch (e) {
        console.log("Server Error:", e);
        res.json({ status: false, message: 'Server Error!' });
    }
});









router.post('/submit_purchasing', upload.any('picture'), function (req, res) {
    try {
        var filenames=req.files.map((file,index)=>file.filename)
        pool.query('insert into purchasing (productid, brandid, categoryid, modelno, description, color, stock,  picture,date) values (?,?,?,?,?,?,?,?,?)',
            [req.body.productid, req.body.brandid, req.body.categoryid, req.body.modelno, req.body.description, req.body.color, req.body.stock,  filenames+"",req.body.date], function (error, result) {
                if (error) {
                    res.json({ status: false, message: 'Database Error!' })
                    console.log(error)
                }
                else {
                    res.json({ status: true, message: 'Product Details added successfully!' })
                }
            })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})

router.post('/submit_issued', upload.any('picture'), function (req, res) {
    try {
        var filenames=req.files.map((file,index)=>file.filename)
        pool.query('insert into issued (productid, brandid, categoryid,employeeid, modelno, description, color, price, stock, status, itemcode, picture,date,time,signature) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.productid, req.body.brandid, req.body.categoryid,req.body.employeeid, req.body.modelno, req.body.description, req.body.color, req.body.price,req.body.stock, req.body.status, req.body.itemcode, filenames+"",req.body.date,req.body.time,req.body.signature], function (error, result) {
                if (error) {
                    res.json({ status: false, message: 'Database Error!' })
                    console.log(error)
                }
                else {
                    res.json({ status: true, message: 'Product Issued successfully!' })
                }
            })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})





// router.post("/import_received_excel", async (req, res) => {
//     const { data } = req.body;
  
//     console.log("📥 Received Excel Data:", data); // Logs full array
  
//     if (!Array.isArray(data) || data.length === 0) {
//       return res.status(400).json({ status: false, message: "No data received" });
//     }
  
//     try {
//       for (let index = 0; index < data.length; index++) {
//         const item = data[index];
  
//         console.log(`🔍 Row ${index + 1} Fields:`);
//         console.log("Employee ID:", item["Employee ID"]);
//         console.log("Product ID:", item["Product ID"]);
//         console.log("Brand ID:", item["Brand ID"]);
//         console.log("Item Code:", item["Item Code"]);
//         console.log("Model No:", item["Model No"]);
//         console.log("Color:", item["Color"]);
//         console.log("Price:", item["Price"]);
//         console.log("Description:", item["Description"]);
//         console.log("Status:", item["Status"]);
//         console.log("Date of Received:", item["Date of Received"]);
//         console.log("Time of Received:", item["Time of Received"]);
//         console.log("Total Stock:", item["Total Stock"]);
//         console.log("--------------------------------");
  
//         if (
//           item["Employee ID"] &&
//           item["Product ID"] &&
//           item["Brand ID"] &&
//           item["Item Code"]
//         ) {
//           await db.query(
//             `INSERT INTO received 
//             (employeeid, productid, brandid, itemcode, modelno, color, price, description, status, date, time, stock) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//               item["Employee ID"],
//               item["Product ID"],
//               item["Brand ID"],
//               item["Item Code"],
//               item["Model No"] || "",
//               item["Color"] || "",
//               item["Price"] || 0,
//               item["Description"] || "",
//               item["Status"] || "",
//               item["Date of Received"] || null,
//               item["Time of Received"] || null,
//               item["Total Stock"] || 0,
//             ]
//           );
//         } else {
//           console.warn("⚠️ Skipped row due to missing mandatory fields:", item);
//         }
//       }
  
//       return res.json({ status: true, message: "Excel data imported successfully" });
  
//     } catch (error) {
//       console.error("❌ Error importing Excel data:", error);
//       return res.status(500).json({ status: false, message: "Server error during import" });
//     }
//   });
  
  
  




router.post('/submit_received', upload.any('picture'), function (req, res) {
    try {
        var filenames=req.files.map((file,index)=>file.filename)
        pool.query('insert into received (productid, brandid, categoryid,employeeid, modelno, description, color, price, stock, status, itemcode, picture,returndate,time,signature) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.productid, req.body.brandid, req.body.categoryid,req.body.employeeid, req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.stock, req.body.status, req.body.itemcode, filenames+"",req.body.returndate,req.body.time,req.body.signature], function (error, result) {
                if (error) {
                    res.json({ status: false, message: 'Database Error!' })
                    console.log(error)
                }
                else {
                    res.json({ status: true, message: 'Product Received successfully!' })
                }
            })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})




router.get("/fetch_all_employees", function(req, res, next) {
    
    try {
        pool.query("SELECT * FROM employee", function(error, result) {
            if (error) {
                console.log("Database Error:", error);  // Log error if there is an issue with the database
                return res.status(500).json({status: false, message: "DataBase Error, Plz Contact DataBase Admin"});
            } else {
                console.log("Fetched Employees Data:", result);  // Log the fetched data to check if it's correct
                return res.status(200).json({data: result, status: true, message: "Success!"});
            }
        });
    } catch (e) {
        console.log("Server Error:", e);  // Log any errors that occur outside of the database query
        return res.status(500).json({ status: false, message: "Server Error...!" });
    }
});


router.get("/fetch_all_issued", function(req, res, next) {
    
    try {
        pool.query("SELECT * FROM issued", function(error, result) {
            if (error) {
                console.log("Database Error:", error);  // Log error if there is an issue with the database
                return res.status(500).json({status: false, message: "DataBase Error, Plz Contact DataBase Admin"});
            } else {
                console.log("Fetched Employees Data:", result);  // Log the fetched data to check if it's correct
                return res.status(200).json({data: result, status: true, message: "Success!"});
            }
        });
    } catch (e) {
        console.log("Server Error:", e);  // Log any errors that occur outside of the database query
        return res.status(500).json({ status: false, message: "Server Error...!" });
    }
});


router.get("/fetch_all_received", function(req, res, next) {
    try {
        // Execute the database query
        pool.query("SELECT * FROM received", function(error, result) {
            if (error) {
                // Log database error if any
                console.log("Database Error:", error);  // This will log the error in case of failure
                return res.status(500).json({
                    status: false,
                    message: "Database Error, Please Contact Database Admin"
                });
            } else {
                // Log the fetched data if the query is successful
                console.log("Fetched Data from 'received' table:", result);  // Log the result object

                if (result && result.length > 0) {
                    // If there is data, return it in the response
                    return res.status(200).json({
                        data: result, 
                        status: true, 
                        message: "Success!"
                    });
                } else {
                    // If no data is fetched, log and return an appropriate message
                    console.log("No data found in 'received' table.");
                    return res.status(200).json({
                        data: [],
                        status: true,
                        message: "No data found"
                    });
                }
            }
        });
    } catch (e) {
        // Log any unexpected errors that might occur
        console.log("Server Error:", e);  // This will log errors occurring outside of the database query
        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
});





router.get("/fetch_all_employees", function(req, res, next) {
    
    try {
        pool.query("SELECT * FROM employee", function(error, result) {
            if (error) {
                console.log("Database Error:", error);  // Log error if there is an issue with the database
                return res.status(500).json({status: false, message: "DataBase Error, Plz Contact DataBase Admin"});
            } else {
                console.log("Fetched Employees Data:", result);  // Log the fetched data to check if it's correct
                return res.status(200).json({data: result, status: true, message: "Success!"});
            }
        });
    } catch (e) {
        console.log("Server Error:", e);  // Log any errors that occur outside of the database query
        return res.status(500).json({ status: false, message: "Server Error...!" });
    }
});


router.get("/fetch_all_details", function(req, res, next) {
    
    try {
        pool.query("SELECT * FROM productdetails", function(error, result) {
            if (error) {
                console.log("Database Error:", error);  // Log error if there is an issue with the database
                return res.status(500).json({status: false, message: "DataBase Error, Plz Contact DataBase Admin"});
            } else {
                console.log("Fetched Employees Data:", result);  // Log the fetched data to check if it's correct
                return res.status(200).json({data: result, status: true, message: "Success!"});
            }
        });
    } catch (e) {
        console.log("Server Error:", e);  // Log any errors that occur outside of the database query
        return res.status(500).json({ status: false, message: "Server Error...!" });
    }
});




router.get('/fetch_product_details', function (req, res) {
    try {
        pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname, (select B.brandname from brands B where B.brandid = P.brandid) as brandname, (select Pr.productname from products Pr where Pr.productid = P.productid) as productname from productdetails P', function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                res.json({ status: true, data: result })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})



router.post('/update_employee', function (req, res, next) {
    try {
        const { employeeid, employeename, designation, department } = req.body;

        console.log("Received data from frontend:", req.body); // Log received data

        pool.query(
            'UPDATE employee SET employeename = ? WHERE employeeid = ?',
            [employeename],
            function (error, result) {
                if (error) {
                    console.error("Database Error:", error); // Log database error
                    res.json({ status: false, message: 'Database Error!' });
                } else {
                    console.log("Update successful:", result); // Log success response
                    res.json({ status: true, message: 'Employee details updated successfully!' });
                }
            }
        );
    } catch (e) {
        console.error("Server Error:", e); // Log server error
        res.json({ status: false, message: 'Server Error!' });
    }
});



router.post('/update_productdetails_data', function (req, res, next) {
    try {
        pool.query('update productdetails set productid = ?, categoryid = ?, brandid = ?, modelno = ?, description = ?, color = ?, price = ?, offerprice = ?, stock = ?, status = ?, hsncode = ? where productdetailid = ?',
            [req.body.productid, req.body.categoryid, req.body.brandid, req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, req.body.hsncode, req.body.productdetailid], function (error, result) {
                if (error) {
                    res.json({ status: false, message: 'Database Error!' })
                }
                else {
                    res.json({ status: true, message: 'Product Details updated successfully!' })
                }
            })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/update_product_details_picture', upload.single('picture'), function (req, res, next) {
    try {
        pool.query('update productdetails set picture = ? where productdetailid = ?', [req.file.filename, req.body.productdetailid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
                console.log(error)
            }
            else {
                res.json({ status: true, message: 'Product Picture updated successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})

router.post('/delete_product_details', function (req, res, next) {
    try {
        pool.query('delete from productdetails where productdetailsid = ?', [req.body.productdetailsid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                res.json({ status: true, message: 'Product Details deleted successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})
module.exports = router;
