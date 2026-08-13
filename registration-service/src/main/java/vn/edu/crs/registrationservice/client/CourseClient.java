package vn.edu.crs.registrationservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class CourseClient {

    private final RestTemplate restTemplate;

    @Value("${course-service.base-url}")
    private String courseServiceBaseUrl;


    // =========================================================
    // GIỮ CHỖ - RESERVE SEAT
    // =========================================================
    public void reserveSeat(Long courseId) {

        String url = courseServiceBaseUrl
                + "/internal/courses/"
                + courseId
                + "/reserve-seat";

        try {

            restTemplate.exchange(
                    url,
                    HttpMethod.PATCH,
                    null,
                    Void.class
            );

        } catch (HttpClientErrorException.Conflict e) {

            // HTTP 409
            throw new IllegalStateException(
                    "Mon hoc da het cho"
            );

        } catch (HttpClientErrorException.NotFound e) {

            // HTTP 404
            throw new IllegalStateException(
                    "Mon hoc khong ton tai"
            );

        } catch (HttpServerErrorException e) {

            // HTTP 5xx
            throw new IllegalStateException(
                    "Course-service dang gap loi, vui long thu lai sau"
            );

        } catch (ResourceAccessException e) {

            // Không kết nối được course-service
            throw new IllegalStateException(
                    "Khong the ket noi toi course-service, vui long thu lai sau"
            );
        }
    }


    // =========================================================
    // TRẢ CHỖ - RELEASE SEAT
    // =========================================================
    public void releaseSeat(Long courseId) {

        String url = courseServiceBaseUrl
                + "/internal/courses/"
                + courseId
                + "/release-seat";

        try {

            restTemplate.exchange(
                    url,
                    HttpMethod.PATCH,
                    null,
                    Void.class
            );

        } catch (HttpClientErrorException.NotFound e) {

            // HTTP 404
            throw new IllegalStateException(
                    "Mon hoc khong ton tai"
            );

        } catch (HttpServerErrorException e) {

            throw new IllegalStateException(
                    "Course-service dang gap loi, vui long thu lai sau"
            );

        } catch (ResourceAccessException e) {

            throw new IllegalStateException(
                    "Khong the ket noi toi course-service, vui long thu lai sau"
            );
        }
    }
}