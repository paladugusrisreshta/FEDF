<?php
// backend/php/api/bookings.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method === 'POST') {
    // Read JSON data
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->guestName) && !empty($data->roomType)) {
        // Query model
        $query = "INSERT INTO bookings SET 
                    guest_name=:guestName, room_type=:roomType, 
                    check_in=:checkIn, check_out=:checkOut, 
                    amount=:amount, status='Confirmed'";
                    
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":guestName", $data->guestName);
        $stmt->bindParam(":roomType", $data->roomType);
        $stmt->bindParam(":checkIn", $data->checkIn);
        $stmt->bindParam(":checkOut", $data->checkOut);
        $stmt->bindParam(":amount", $data->amount);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Booking was successfully registered.", "bookingId" => $db->lastInsertId()));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to process booking reservation."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Data incomplete."));
    }
} else if ($request_method === 'GET') {
    // Query entries
    $query = "SELECT * FROM bookings ORDER BY check_in DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();
    
    if ($num > 0) {
        $bookings_arr = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $booking_item = array(
                "id" => $id,
                "guestName" => $guest_name,
                "roomType" => $room_type,
                "checkIn" => $check_in,
                "checkOut" => $check_out,
                "amount" => $amount,
                "status" => $status
            );
            array_push($bookings_arr, $booking_item);
        }
        http_response_code(200);
        echo json_encode($bookings_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No bookings found."));
    }
}
?>
