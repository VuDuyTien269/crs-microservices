package vn.edu.crs.courseservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.crs.courseservice.Entity.Course;
import vn.edu.crs.courseservice.dto.CourseDTO;
import vn.edu.crs.courseservice.repository.CourseRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    // =====================================================
    // 1. GET ALL - BUỔI 2
    // =====================================================
    public List<CourseDTO> getAll() {

        return courseRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // 2. GET BY ID - BUỔI 2
    // =====================================================
    public CourseDTO getById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = " + id
                        )
                );

        return toDTO(course);
    }

    // =====================================================
    // 3. CREATE - BUỔI 2
    // =====================================================
    public CourseDTO create(CourseDTO dto) {

        if (courseRepository.existsByTenMonHocIgnoreCase(
                dto.getTenMonHoc())) {

            throw new IllegalArgumentException(
                    "Ten mon hoc da ton tai"
            );
        }

        Course course = new Course();

        course.setTenMonHoc(dto.getTenMonHoc());
        course.setSoTinChi(dto.getSoTinChi());
        course.setSoChoToiDa(dto.getSoChoToiDa());

        // Khi tạo mới:
        // số chỗ còn lại = số chỗ tối đa
        course.setSoChoConLai(dto.getSoChoToiDa());

        course = courseRepository.save(course);

        return toDTO(course);
    }

    // =====================================================
    // 4. UPDATE - BUỔI 2
    // =====================================================
    public CourseDTO update(Long id, CourseDTO dto) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = " + id
                        )
                );

        course.setTenMonHoc(dto.getTenMonHoc());
        course.setSoTinChi(dto.getSoTinChi());
        course.setSoChoToiDa(dto.getSoChoToiDa());

        course = courseRepository.save(course);

        return toDTO(course);
    }

    // =====================================================
    // 5. DELETE - BUỔI 2
    // =====================================================
    public void delete(Long id) {

        if (!courseRepository.existsById(id)) {

            throw new NoSuchElementException(
                    "Khong tim thay mon hoc id = " + id
            );
        }

        courseRepository.deleteById(id);
    }

    // =====================================================
    // 6. SEARCH + PAGINATION - BUỔI 3
    // =====================================================
    public Page<CourseDTO> search(
            String keyword,
            Pageable pageable) {

        Page<Course> page;

        // Không có keyword
        if (keyword == null || keyword.isBlank()) {

            page = courseRepository.findAll(pageable);

        } else {

            // Có keyword
            page = courseRepository
                    .findByTenMonHocContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        return page.map(this::toDTO);
    }

    // =====================================================
    // 7. RESERVE SEAT - BUỔI 3
    // =====================================================
    @Transactional
    public CourseDTO reserveSeat(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = "
                                        + courseId
                        )
                );

        // Kiểm tra còn chỗ hay không
        if (course.getSoChoConLai() <= 0) {

            throw new IllegalStateException(
                    "Mon hoc da het cho, khong the dang ky"
            );
        }

        // Trừ 1 chỗ
        course.setSoChoConLai(
                course.getSoChoConLai() - 1
        );

        // Lưu database
        course = courseRepository.save(course);

        return toDTO(course);
    }

    // =====================================================
    // 8. RELEASE SEAT - BUỔI 3
    // =====================================================
    @Transactional
    public CourseDTO releaseSeat(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Khong tim thay mon hoc id = "
                                        + courseId
                        )
                );

        // Không cho số chỗ còn lại vượt quá số chỗ tối đa
        if (course.getSoChoConLai()
                < course.getSoChoToiDa()) {

            // Hoàn lại 1 chỗ
            course.setSoChoConLai(
                    course.getSoChoConLai() + 1
            );
        }

        // Lưu database
        course = courseRepository.save(course);

        return toDTO(course);
    }

    // =====================================================
    // 9. CONVERT ENTITY -> DTO
    // =====================================================
    private CourseDTO toDTO(Course course) {

        return new CourseDTO(
                course.getId(),
                course.getTenMonHoc(),
                course.getSoTinChi(),
                course.getSoChoToiDa(),
                course.getSoChoConLai()
        );
    }
}

